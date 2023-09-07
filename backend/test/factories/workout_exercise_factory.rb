FactoryBot.define do
  factory :workout_exercise do
    workout
    exercise
    sets { 3 }
    reps { 10 }
    created_at { Time.current }
    updated_at { Time.current }
    position { 1 }
  end
end
