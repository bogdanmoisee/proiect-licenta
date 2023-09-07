require 'rails_helper'

RSpec.describe Relationship, type: :model do
  before do
    @follower = User.create(username: 'follower', email: 'follower@example.com', password: 'password')
    @followed = User.create(username: 'followed', email: 'followed@example.com', password: 'password')
    @relationship = Relationship.new(follower_id: @follower.id, followed_id: @followed.id)
  end

  subject { @relationship }

  it { should respond_to(:follower_id) }
  it { should respond_to(:followed_id) }

  it 'should be valid when all attributes are present' do
    expect(@relationship).to be_valid
  end

  describe 'when follower_id is not present' do
    before { @relationship.follower_id = nil }
    it { should_not be_valid }
  end

  describe 'when followed_id is not present' do
    before { @relationship.followed_id = nil }
    it { should_not be_valid }
  end
end
