# KYC Fraud Shield - Testing Guide

## Prerequisites
Ensure both servers are running:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:5000 (Express server)

---

## 🧪 Test Checklist

### 1. Landing Page Test
**URL**: http://localhost:3000/

| Test | Expected Result |
|------|-----------------|
| Page loads | Dark theme hero section with logo |
| "Get Started" button | Navigates to /register |
| "Start KYC Verification" button | Navigates to /application/new |
| "View Dashboard" button | Navigates to /dashboard |
| Feature cards visible | 4 feature cards (Document, Biometric, Behavioral, ML) |
| Pipeline steps visible | 7 steps shown at bottom |

---

### 2. Registration Test
**URL**: http://localhost:3000/register

| Test | Expected Result |
|------|-----------------|
| Empty form submission | "Please fill in all fields" error |
| Password mismatch | "Passwords do not match" error |
| Short password (<6 chars) | "Password must be at least 6 characters" error |
| Valid registration | Redirects to /dashboard with success toast |

**Test Data**:
```
Name: Test User
Email: test@example.com
Password: password123
Confirm: password123
```

---

### 3. Login Test
**URL**: http://localhost:3000/login

| Test | Expected Result |
|------|-----------------|
| Empty form submission | "Please fill in all fields" error |
| Wrong credentials | "Invalid credentials" error |
| Valid login | Redirects to /dashboard |

**Use the account you just registered!**

---

### 4. Dashboard Test
**URL**: http://localhost:3000/dashboard (requires login)

| Test | Expected Result |
|------|-----------------|
| Stats cards visible | 4 stat cards (Total, Approved, Rejected, Pending) |
| Risk chart visible | Pie chart with risk distribution |
| Risk gauge visible | Semi-circle gauge with score |
| Recent applications table | Table with application list (may be empty initially) |

---

### 5. New Application (KYC Flow) Test
**URL**: http://localhost:3000/application/new (requires login)

#### Step 1: Personal Info
| Test | Expected Result |
|------|-----------------|
| Progress indicator | 4 steps shown, Step 1 highlighted |
| Empty submission | Validation errors for required fields |
| Valid submission | Moves to Step 2 (Documents) |

**Test Data**:
```
Full Name: John Doe
Date of Birth: 1990-05-15
Email: john@example.com
Phone: 5551234567
SSN: 123456789
Address: 123 Main Street
City: New York
State: NY
ZIP: 10001
Country: United States
```

#### Step 2: Document Upload
| Test | Expected Result |
|------|-----------------|
| Drag & drop area visible | Upload zone with icon |
| Click to browse works | File picker opens |
| Upload image file | Preview shows, analysis starts |
| Skip button works | Moves to Step 3 |

*Note: Upload any JPG/PNG image as test document*

#### Step 3: Biometric Verification
| Test | Expected Result |
|------|-----------------|
| Camera access request | Browser asks for webcam permission |
| Face detection | Green box around face when detected |
| Blink detection | Counter increases when you blink |
| 3+ blinks | "Liveness Verified" status, capture button enabled |

*Note: Allow camera access and blink 3 times*

#### Step 4: Review & Submit
| Test | Expected Result |
|------|-----------------|
| Personal info summary | Shows entered data |
| Document summary | Shows upload status |
| Biometric summary | Shows "Liveness Verified" |
| Submit button | Submits and redirects to result page |

---

### 6. Application Detail/Result Test
**URL**: http://localhost:3000/application/{id}

| Test | Expected Result |
|------|-----------------|
| Decision badge | APPROVED, REJECTED, or REVIEW shown |
| Risk score gauge | Score displayed (0-100) |
| Pipeline stages | 7 stages shown with pass/fail indicators |
| Applicant details | Personal info displayed |
| Explanations | List of verification explanations |

---

### 7. Applications List Test
**URL**: http://localhost:3000/applications

| Test | Expected Result |
|------|-----------------|
| Table displays | Shows all submitted applications |
| Search works | Filters by name/email/ID |
| Status filter | Filters by status dropdown |
| Click row | Navigates to application detail |
| "New Application" button | Navigates to /application/new |

---

### 8. Sidebar Navigation Test
| Test | Expected Result |
|------|-----------------|
| Dashboard link | Navigates to /dashboard |
| New Application link | Navigates to /application/new |
| Applications link | Navigates to /applications |
| Collapse button | Sidebar collapses/expands |
| Logout button | Logs out, redirects to /login |

---

### 9. Protected Routes Test
| Test | Expected Result |
|------|-----------------|
| Visit /dashboard without login | Redirects to /login |
| Visit /application/new without login | Redirects to /login |
| Visit /login when logged in | Redirects to /dashboard |

---

## 🔧 API Endpoint Tests (Optional)

You can test backend APIs directly using browser or curl:

### Health Check
```
GET http://localhost:5000/health
```

### Register (POST)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"api@test.com","password":"123456"}'
```

### Login (POST)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"api@test.com","password":"123456"}'
```

### Dashboard Stats (GET) - requires token
```bash
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ Quick Verification Steps

1. Open http://localhost:3000/ → See landing page
2. Click "Get Started" → See register page
3. Register with test data → Redirected to dashboard
4. Click "New Application" → Start KYC flow
5. Complete all 4 steps → See result page
6. Go to "Applications" → See your submission
7. Click logout → Return to login page

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Network error on register | Check backend is running on port 5000 |
| Camera not working | Allow camera permission in browser |
| Face not detected | Ensure good lighting, face the camera |
| Page not loading | Check frontend is running on port 3000 |

---

**Happy Testing! 🎉**
