import { useState } from 'react';
import { Input, Select, Button } from '../Common';
import { COUNTRIES, US_STATES } from '../../utils/constants';
import { formatSSN, formatPhone } from '../../utils/helpers';

const PersonalInfoForm = ({ onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        ssn: '',
        address: '',
        city: '',
        state: '',
        country: 'United States',
        zipCode: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'ssn') {
            formattedValue = formatSSN(value);
        } else if (name === 'phone') {
            formattedValue = formatPhone(value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.ssn.trim()) {
            newErrors.ssn = 'SSN is required';
        } else if (formData.ssn.replace(/\D/g, '').length !== 9) {
            newErrors.ssn = 'SSN must be 9 digits';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state) {
            newErrors.state = 'State is required';
        }

        if (!formData.country) {
            newErrors.country = 'Country is required';
        }

        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    error={errors.fullName}
                    required
                />

                <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    required
                />

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    error={errors.email}
                    required
                />

                <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    error={errors.phone}
                    required
                />

                <Input
                    label="Social Security Number"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleChange}
                    placeholder="XXX-XX-XXXX"
                    error={errors.ssn}
                    required
                />

                <Input
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    error={errors.zipCode}
                    required
                />
            </div>

            <Input
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Apt 4"
                error={errors.address}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    error={errors.city}
                    required
                />

                <Select
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    options={US_STATES}
                    placeholder="Select state"
                    error={errors.state}
                    required
                />

                <Select
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={COUNTRIES}
                    placeholder="Select country"
                    error={errors.country}
                    required
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" loading={loading} size="lg">
                    Continue to Document Upload
                </Button>
            </div>
        </form>
    );
};

export default PersonalInfoForm;
