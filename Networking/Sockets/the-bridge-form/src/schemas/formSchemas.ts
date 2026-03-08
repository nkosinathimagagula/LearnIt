import * as yup from 'yup';

export const step1Schema = yup.object({
  firstName: yup.string().required('First name is required').min(2),
  lastName: yup.string().required('Last name is required').min(2),
}).required();

export const step2Schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  address: yup.string().required('Street address is required').min(5, 'Address is too short'),
}).required();

export const mobileStepSchema = yup.object({
  idNumber: yup.string().required('ID Number is required').length(13, "ID Number must be exactly 13 characters"),
  phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, "Must be only digits").length(10, "Phone number must be exactly 10 digits"),
}).required();

export const step5Schema = yup.object({
  preferences: yup.string().required('Please select an option'),
  agreeToTerms: yup.boolean().oneOf([true], 'You must accept the terms'),
}).required();
