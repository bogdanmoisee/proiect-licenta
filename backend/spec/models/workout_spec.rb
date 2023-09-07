require 'rails_helper'

RSpec.describe Workout, type: :model do
  let(:workout) { FactoryBot.create(:workout) }

  # Test if a workout can be created with valid attributes
  it 'is valid with valid attributes' do
    expect(workout).to be_valid
  end

  # Test for name presence
  it 'is not valid with a name' do
    workout.name = nil
    expect(workout).to be_valid
  end

  # Test for user_id presence
  it 'is not valid without a user_id' do
    workout.user_id = nil
    expect(workout).to_not be_valid
  end

  # Test for parent_id (Optional based on your model validation)
  it 'is valid without a parent_id' do
    workout.parent_id = nil
    expect(workout).to be_valid
  end
end
