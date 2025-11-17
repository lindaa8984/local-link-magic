-- Add allowance columns to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS housing_allowance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS transportation_allowance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS food_allowance numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_allowances numeric DEFAULT 0;