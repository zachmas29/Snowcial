import "@testing-library/jest-dom"; // add the jest-dom matchers

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

// Mock timezone to UTC for consistent test results across environments
process.env.TZ = "UTC";
