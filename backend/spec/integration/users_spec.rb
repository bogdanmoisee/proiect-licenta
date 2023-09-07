# spec/requests/api/v1/users_spec.rb

require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let!(:user) { create(:user) }
  let!(:other_user) { create(:user) }
  let(:token) { create(:doorkeeper_access_token, resource_owner_id: user.id).token }

  describe 'GET /me' do
    it "returns the current user's details when authorized" do
      get '/api/v1/users/me', headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(response.body).to include(user.email)
    end

    it 'returns unauthorized when not authorized' do
      get '/api/v1/users/me', headers: { Authorization: 'Bearer invalid_token' }
      expect(response).to have_http_status(401)
    end
  end

  describe 'GET /:user_id' do
    it "returns the specified user's details when authorized" do
      get "/api/v1/users/#{user.id}", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(response.body).to include(user.email)
    end

    it 'returns not found when user does not exist' do
      get '/api/v1/users/9999', headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(422)
    end
  end

  describe 'GET /:user_id/other-users' do
    it 'returns a list of other users' do
      get "/api/v1/users/#{user.id}/other-users", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(response.body).not_to include(user.email)
      expect(response.body).to include(other_user.email)
    end
  end

  describe 'GET /:user_id/following-users' do
    it 'returns a list of users that the specified user is following' do
      user.follow(other_user)
      get "/api/v1/users/#{user.id}/following-users?current_user_id=#{user.id}", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(response.body).to include(other_user.email)
    end
  end

  describe 'POST /:id/follow' do
    it 'follows the specified user' do
      post "/api/v1/users/#{other_user.id}/follow", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(user.following?(other_user)).to be true
    end
  end

  describe 'POST /:id/unfollow' do
    it 'unfollows the specified user' do
      user.follow(other_user)
      post "/api/v1/users/#{other_user.id}/unfollow", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
      expect(user.following?(other_user)).to be false
    end
  end
end
