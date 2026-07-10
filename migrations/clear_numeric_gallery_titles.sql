-- Run this once in Supabase SQL Editor: https://supabase.com/dashboard/project/hxvvigkrqlcdkzlcwkot/sql/new
-- Clears titles that are just a raw camera filename (all digits) left over from the old
-- bulk-upload bug, so those gallery cards stop showing numbers like "1000144214".

update public.gallery
set title = ''
where title ~ '^[0-9]+$';
