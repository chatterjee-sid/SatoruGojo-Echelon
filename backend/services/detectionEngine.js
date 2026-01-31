const fs = require('fs');
const path = require('path');

class DetectionEngine {
    constructor() {
        this.records = [];
        // Blocklist of common disposable email domains
        this.disposableDomains = new Set([
            'tempmail.com', 'throwawaymail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com',
            'yopmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com', 'fake-email.com'
        ]);
        // Mock blacklist of known fraud embeddings (array of arrays)
        this.fraudEmbeddings = [];
    }

    /**
     * Calculate age from date of birth
     */
    calculateAge(dob) {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * Rule: Name Entropy
     * Implement a Shannon Entropy or character-frequency-based check to flag gibberish names.
     */
    calculateNameEntropy(name) {
        if (!name) return 0;
        const len = name.length;
        const frequencies = {};
        for (let char of name.toLowerCase()) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }

        let entropy = 0;
        for (let char in frequencies) {
            const p = frequencies[char] / len;
            entropy -= p * Math.log2(p);
        }
        return entropy;
    }

    detectGibberishName(record) {
        const reasons = [];
        const entropy = this.calculateNameEntropy(record.name);
        // Threshold: Random strings often have high entropy, but very repetitive ones have low.
        // Also checks for keyboard mashing or very short names.
        // Typical english text entropy is ~4.0. Random alphanumeric is higher (~5+).
        // Very low entropy (e.g. "aaaaa") is also suspicious.

        // Simple heuristic: If entropy > 4.5 (very random) or < 1.0 (very repetitive) and length > 3
        if ((entropy > 4.5 || (entropy < 1.5 && record.name.length > 3))) {
            reasons.push({
                rule: 'Name Anomaly (Entropy)',
                severity: 'medium',
                details: `Name "${record.name}" has suspicious entropy score: ${entropy.toFixed(2)}`,
                entropy: entropy
            });
        }
        return reasons;
    }

    /**
     * Rule: Email Risk
     * Identify disposable email domains and check for 'dots' or 'plus' sub-addressing.
     */
    checkEmailRisk(email) {
        if (!email || !email.includes('@')) return { isRisky: false, reason: null };

        const [localPart, domain] = email.split('@');

        // Check 1: Disposable Domain
        if (this.disposableDomains.has(domain.toLowerCase())) {
            return { isRisky: true, reason: 'Disposable Domain' };
        }

        // Check 2: Sub-addressing (Plus or Dots)
        // Note: Dots are common in gmail, but excessive dots or plus might be evasion.
        if (localPart.includes('+')) {
            return { isRisky: true, reason: 'Plus Addressing Detected' };
        }

        // Check for aggressive dot usage (e.g., more than 3 dots)
        // Legitimate users rarely have many dots.
        const dotCount = (localPart.match(/\./g) || []).length;
        if (dotCount > 3) {
            return { isRisky: true, reason: 'Excessive Dot Addressing' };
        }

        return { isRisky: false, reason: null };
    }

    detectEmailRisk(record) {
        const reasons = [];
        const risk = this.checkEmailRisk(record.email);
        if (risk.isRisky) {
            reasons.push({
                rule: 'Email Risk',
                severity: 'medium',
                details: `Email "${record.email}" flagged: ${risk.reason}`,
                riskType: risk.reason
            });
        }
        return reasons;
    }

    /**
     * Rule: Document Age Validation
     * Logic to ensure the document issuance is chronologically possible given the user's birth date.
     */
    validateDocumentAge(dob, docIssueDate) {
        if (!dob || !docIssueDate) return { isValid: true };

        const dobDate = new Date(dob);
        const issueDate = new Date(docIssueDate);

        if (issueDate < dobDate) {
            return { isValid: false, reason: 'Document Issued Before Birth' };
        }

        // Ideally check min age for document (e.g. 16 for DL), assuming 0 for generic
        const ageAtIssue = (issueDate.getFullYear() - dobDate.getFullYear());
        if (ageAtIssue < 0) {
            return { isValid: false, reason: 'Negative Age at Issue' };
        }

        return { isValid: true };
    }

    detectDocumentAnomalies(record) {
        const reasons = [];
        if (record.docIssueDate) {
            const validation = this.validateDocumentAge(record.dob, record.docIssueDate);
            if (!validation.isValid) {
                reasons.push({
                    rule: 'Document Validation',
                    severity: 'critical',
                    details: `Document Issue Date invalid relative to DOB: ${validation.reason}`,
                });
            }
        }
        return reasons;
    }

    /**
     * Rule: Phone Velocity
     * Query the legitimateUsers (allRecords) to count how many distinct userIds are linked to this phone number.
     * Flag if count > 2.
     */
    checkPhoneVelocity(phone, allRecords) {
        if (!phone || !allRecords) return 0;

        const linkedUsers = allRecords
            .filter(r => r.phone === phone)
            .map(r => r.userId);

        const uniqueUsers = new Set(linkedUsers);
        return uniqueUsers.size;
    }

    detectPhoneVelocity(record, allRecords) {
        const reasons = [];
        const uniqueCount = this.checkPhoneVelocity(record.phone, allRecords);
        // Note: The count includes the current record if it's in allRecords.
        // User said "Flag if count > 2".
        if (uniqueCount > 2) {
            reasons.push({
                rule: 'Phone Velocity',
                severity: 'high',
                details: `Phone "${record.phone}" linked to ${uniqueCount} distinct identities`,
                count: uniqueCount
            });
        }
        return reasons;
    }

    /**
     * Rule: Network Density
     * Logic to detect if the same IP/Device combo is attempting to register multiple identities within a short window.
     */
    checkNetworkDensity(ip, deviceId, allRecords) {
        if (!ip || !deviceId || !allRecords) return 0;

        // "Short window" logic requires timestamps. Assuming records have 'timestamp' or 'created_at'.
        // If no timestamp, we default to total density.
        // Let's assume a 1-hour window if timestamp exists.

        const WINDOW_MS = 60 * 60 * 1000; // 1 hour
        const now = new Date(); // Or use record's time

        // Filter for matching IP/Device
        const matches = allRecords.filter(r => r.ip === ip && r.deviceId === deviceId);

        let density = matches.length;

        // If timestamps available, filter by window (optional refinement)
        // For now, we'll stick to simple density count of distinct users as per "register multiple identities"
        const uniqueUsers = new Set(matches.map(r => r.userId));
        return uniqueUsers.size;
    }

    detectNetworkDensity(record, allRecords) {
        const reasons = [];
        const densityCount = this.checkNetworkDensity(record.ip, record.deviceId, allRecords);

        // If the same IP+Device is used by multiple users (e.g. > 1 or > 2?)
        // Standard "multiple identities" creates suspicion. 
        // Existing logic used > 0 "other" records (so >= 2 total).
        // Let's follow the pattern: If density > 1 (meaning more than just this user), flag it.
        // Or if strictly "multiple", > 1.

        if (densityCount > 1) {
            reasons.push({
                rule: 'Network Density',
                severity: 'critical',
                details: `IP/Device combination used by ${densityCount} distinct identities`,
                count: densityCount
            });
        }
        return reasons;
    }

    /**
     * Rule: Face Comparison
     * Use a Cosine Similarity function to compare the user's face vector against a 'blacklist' of known fraud embeddings.
     */
    cosineSimilarity(vecA, vecB) {
        if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    compareFaceEmbeddings(currentEmbedding, storedEmbeddings) {
        if (!currentEmbedding || !storedEmbeddings || storedEmbeddings.length === 0) return false;

        const THRESHOLD = 0.9; // Similarity threshold for match

        for (let stored of storedEmbeddings) {
            const similarity = this.cosineSimilarity(currentEmbedding, stored);
            if (similarity > THRESHOLD) {
                return true;
            }
        }
        return false;
    }

    detectFaceBlacklist(record) {
        const reasons = [];
        if (record.faceEmbedding) {
            const isMatch = this.compareFaceEmbeddings(record.faceEmbedding, this.fraudEmbeddings);
            if (isMatch) {
                reasons.push({
                    rule: 'Face Blacklist Match',
                    severity: 'critical',
                    details: 'Face embedding matches known fraudster',
                });
            }
        }
        return reasons;
    }

    /**
     * Existing Rule: Age Mismatch (Preserved)
     */
    detectAgeMismatch(record) {
        const reasons = [];
        if (record.faceAge) {
            const calculatedAge = this.calculateAge(record.dob);
            const ageVariance = Math.abs(calculatedAge - record.faceAge);

            if (ageVariance > 5) {
                reasons.push({
                    rule: 'Age Mismatch',
                    severity: 'high',
                    details: `DOB age ${calculatedAge} vs Face age ${record.faceAge} (Diff: ${ageVariance})`,
                    calculatedAge,
                    variance: ageVariance
                });
            }
        }
        return reasons;
    }

    /**
     * Existing Rule: Behavioral (Preserved)
     */
    detectBehavioralPatterns(record) {
        const reasons = [];
        const BOT_THRESHOLD = 2000;

        if (record.formTime && record.formTime < BOT_THRESHOLD) {
            reasons.push({
                rule: 'Behavioral Pattern - Bot Suspected',
                severity: 'medium',
                details: `Form completed too quickly (${(record.formTime / 1000).toFixed(2)}s)`,
            });
        }
        return reasons;
    }

    /**
     * Calculate risk score
     */
    calculateRiskScore(reasons) {
        if (reasons.length === 0) return 0;

        const severityWeights = {
            low: 10,
            medium: 25,
            high: 40,
            critical: 60
        };

        let totalScore = 0;
        reasons.forEach(reason => {
            totalScore += severityWeights[reason.severity] || 10;
        });

        return Math.min(totalScore, 100);
    }

    /**
     * Main analysis method
     */
    analyzeRecord(record, allRecords = []) {
        // Ensure allRecords includes the current record for context if needed, 
        // but for counting 'others', we usually check distinct IDs.
        // If allRecords is empty, use this.records if available
        const contextRecords = allRecords.length > 0 ? allRecords : this.records;

        const reasons = [
            ...this.detectAgeMismatch(record),
            ...this.detectBehavioralPatterns(record),
            ...this.detectGibberishName(record),
            ...this.detectEmailRisk(record),
            ...this.detectDocumentAnomalies(record),
            ...this.detectPhoneVelocity(record, contextRecords),
            ...this.detectNetworkDensity(record, contextRecords),
            ...this.detectFaceBlacklist(record)
        ];

        const riskScore = this.calculateRiskScore(reasons);
        const isSynthetic = riskScore >= 70 || reasons.some(r => r.severity === 'critical');

        return {
            ...record,
            analysis: {
                riskScore,
                isSynthetic,
                reasons: reasons.map(r => ({
                    rule: r.rule,
                    severity: r.severity,
                    details: r.details
                })),
                analyzedAt: new Date().toISOString()
            }
        };
    }

    analyze(records) {
        this.records = records;
        return records.map(record => this.analyzeRecord(record, records));
    }

    analyzeSingle(targetRecord, referenceRecords) {
        const allRecords = [targetRecord, ...referenceRecords];
        // Ensure duplicate check handles the fact that targetRecord might be IN referenceRecords if we are not careful,
        // but here we merge them. unique Set checks in velocity/density will handle 'same user' vs 'distinct user'.
        // Wait: if targetRecord has a NEW userId, unique set size will increase.
        // If targetRecord has SAME userId as one in reference, it won't count as additional identity.
        // The implementation checks 'distinct userIds'.
        return this.analyzeRecord(targetRecord, allRecords);
    }
}

module.exports = DetectionEngine;
