class Workout < ApplicationRecord
  belongs_to :user
  has_many :workout_exercises
  has_many :exercises, through: :workout_exercises
end

class Exercise < ApplicationRecord
  has_many :workout_exercises
  has_many :workouts, through: :workout_exercises
end

class WorkoutExercise < ApplicationRecord
  belongs_to :workout
  belongs_to :exercise
end
