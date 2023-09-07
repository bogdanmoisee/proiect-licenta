# spec/models/exercise_spec.rb

require 'rails_helper'

RSpec.describe Exercise, type: :model do
  # Create a new exercise instance before each test
  let(:exercise) { FactoryBot.create(:exercise) }

  # Test if the exercise instance can be successfully created
  it 'is valid with valid attributes' do
    expect(exercise).to be_valid
  end

  # Test for name presence
  it 'is valid without a name' do
    exercise.name = nil
    expect(exercise).to be_valid
  end

  # Test for description presence
  it 'is valid without a description' do
    exercise.description = nil
    expect(exercise).to be_valid
  end

  # Test for body_part presence
  it 'is valid without a body_part' do
    exercise.body_part = nil
    expect(exercise).to be_valid
  end

  # Test for equipment presence
  it 'is valid without equipment' do
    exercise.equipment = nil
    expect(exercise).to be_valid
  end

  # Test for gif_url presence
  it 'is valid without a gif_url' do
    exercise.gif_url = nil
    expect(exercise).to be_valid
  end

  # Test for target presence
  it 'is valid without a target' do
    exercise.target = nil
    expect(exercise).to be_valid
  end
end
