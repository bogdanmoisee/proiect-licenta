FactoryBot.define do
  factory :workout do
    name { 'Morning Cardio' }
    user
    created_at { Time.current }
    updated_at { Time.current }
    parent_id { nil }
  end
end
