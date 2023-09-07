require 'rails_helper'

RSpec.describe WorkoutExercise, type: :model do
  let(:workout_exercise) { FactoryBot.create(:workout_exercise) }

  # Test if a workout_exercise can be created with valid attributes
  it 'is valid with valid attributes' do
    expect(workout_exercise).to be_valid
  end

  # Test for workout_id presence
  it 'is not valid without a workout_id' do
    workout_exercise.workout_id = nil
    expect(workout_exercise).to_not be_valid
  end

  # Test for exercise_id presence
  it 'is not valid without an exercise_id' do
    workout_exercise.exercise_id = nil
    expect(workout_exercise).to_not be_valid
  end

  # Test for sets presence
  it 'is valid without sets' do
    workout_exercise.sets = nil
    expect(workout_exercise).to be_valid
  end

  # Test for reps presence
  it 'is valid without reps' do
    workout_exercise.reps = nil
    expect(workout_exercise).to be_valid
  end

  # Test for position (Optional based on your model validation)
  it 'is valid without a position' do
    workout_exercise.position = nil
    expect(workout_exercise).to be_valid
  end
end
