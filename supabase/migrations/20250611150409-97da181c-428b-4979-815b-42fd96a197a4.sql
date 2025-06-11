
-- Drop existing competitions table and recreate with proper structure
DROP TABLE IF EXISTS public.competitions CASCADE;
DROP TABLE IF EXISTS public.competition_participants CASCADE;

-- Create competitions table with correct structure
CREATE TABLE public.competitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL CHECK (category IN ('practice', 'scheduled')) DEFAULT 'practice',
  problem_statement TEXT NOT NULL,
  function_name TEXT NOT NULL,
  code_template TEXT NOT NULL,
  test_cases JSONB NOT NULL DEFAULT '[]',
  hints JSONB NOT NULL DEFAULT '[]',
  start_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  max_participants INTEGER DEFAULT 100,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competition participants table
CREATE TABLE public.competition_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER DEFAULT 0,
  code_submitted TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(competition_id, user_id)
);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_participants ENABLE ROW LEVEL SECURITY;

-- Policies for competitions
CREATE POLICY "Anyone can view competitions" 
  ON public.competitions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create competitions" 
  ON public.competitions 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policies for participants
CREATE POLICY "Users can view competition participants" 
  ON public.competition_participants 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can join competitions" 
  ON public.competition_participants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" 
  ON public.competition_participants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert sample competitions with proper UUIDs
INSERT INTO public.competitions (
  title, description, difficulty, category, problem_statement, function_name, code_template, test_cases, hints, start_time, duration_minutes
) VALUES 
(
  'Two Sum Problem',
  'Find two numbers in an array that add up to a target sum.',
  'Easy',
  'practice',
  '# Two Sum Problem

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

## Examples:
- Input: nums = [2,7,11,15], target = 9
- Output: [0,1]
- Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

## Notes:
- You may assume that each input would have exactly one solution
- You may not use the same element twice',
  'twoSum',
  '// Find two numbers that add up to target
function twoSum(nums, target) {
  // Your code here
  const numMap = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return [];
}',
  '[{"input": "[2,7,11,15], 9", "expected": "[0,1]"}, {"input": "[3,2,4], 6", "expected": "[1,2]"}, {"input": "[3,3], 6", "expected": "[0,1]"}]',
  '[{"text": "Think about using a hash map to store numbers you have seen.", "penalty": 10}, {"text": "For each number, calculate what its complement should be (target - current number).", "penalty": 20}]',
  NULL,
  25
),
(
  'Binary Search Challenge',
  'Implement binary search to find an element in a sorted array.',
  'Medium',
  'practice', 
  '# Binary Search Implementation

Write a function called binarySearch that takes a sorted array and a target value, then returns the index of the target if found, or -1 if not found.

## Examples:
- Input: [1, 3, 5, 7, 9], target: 5
- Output: 2

- Input: [1, 3, 5, 7, 9], target: 6
- Output: -1',
  'binarySearch',
  '// Implement binary search algorithm
function binarySearch(arr, target) {
  // Your code here
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}',
  '[{"input": "[1, 3, 5, 7, 9], 5", "expected": "2"}, {"input": "[1, 3, 5, 7, 9], 6", "expected": "-1"}, {"input": "[2, 4, 6, 8, 10, 12], 10", "expected": "4"}]',
  '[{"text": "Start with two pointers: left (0) and right (array.length - 1).", "penalty": 20}, {"text": "Compare the middle element with the target.", "penalty": 35}]',
  NULL,
  30
),
(
  'Weekly Algorithm Contest',
  'Test your algorithmic skills in this timed competition.',
  'Medium',
  'scheduled',
  '# Palindrome Check

Write a function to check if a string is a palindrome (reads the same forwards and backwards).

## Examples:
- Input: "racecar"
- Output: true

- Input: "hello"
- Output: false',
  'isPalindrome',
  '// Check if a string is a palindrome
function isPalindrome(s) {
  // Your code here
  s = s.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    if (s[left] !== s[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}',
  '[{"input": "racecar", "expected": "true"}, {"input": "hello", "expected": "false"}, {"input": "A man a plan a canal Panama", "expected": "true"}]',
  '[{"text": "Consider removing non-alphanumeric characters and converting to lowercase.", "penalty": 15}]',
  NOW() + INTERVAL '2 hours',
  45
);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER handle_competitions_updated_at 
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_participants_updated_at 
  BEFORE UPDATE ON public.competition_participants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
