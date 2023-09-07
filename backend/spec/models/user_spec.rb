require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { FactoryBot.create(:user) }

  # Test if a user can be created with valid attributes
  it 'is valid with valid attributes' do
    expect(user).to be_valid
  end

  # Test for email presence
  it 'is not valid without an email' do
    user.email = nil
    expect(user).to_not be_valid
  end

  # Test for email uniqueness
  it 'is not valid if email already exists' do
    FactoryBot.create(:user, email: 'test@example.com')
    user_with_duplicate_email = FactoryBot.build(:user, email: 'test@example.com')
    expect(user_with_duplicate_email).to_not be_valid
  end

  # Test for username presence
  it 'is not valid without a username' do
    user.username = nil
    expect(user).to_not be_valid
  end

  # Test for avatar_url presence (Optional based on your model validation)
  it 'is valid without an avatar_url' do
    user.avatar_url = nil
    expect(user).to be_valid
  end
end
