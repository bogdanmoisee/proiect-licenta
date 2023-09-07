require 'rails_helper'

RSpec.describe Api::V1::WorkoutsController, type: :request do
  let(:user) { create(:user) }
  let(:workout) { create(:workout, user: user) }
  let(:exercise) { create(:exercise) }
  let(:token) { create(:doorkeeper_access_token, resource_owner_id: user.id).token }

  describe 'GET /workouts' do
    it 'returns a list of all workouts' do
      get '/api/v1/workouts'
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /users/:user_id/workouts' do
    it 'returns a list of workouts for a user' do
      get "/api/v1/users/#{user.id}/workouts", headers: { Authorization: "Bearer #{token}" }
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /users/:user_id/following-workouts' do
    it 'returns a list of workouts the user is following' do
      get "/api/v1/users/#{user.id}/following-workouts"
      expect(response).to have_http_status(200)
    end
  end

  describe 'GET /workouts/:id' do
    it 'returns the specified workout' do
      get "/api/v1/workouts/#{workout.id}"
      expect(response).to have_http_status(200)
    end
  end

  describe 'POST /workouts' do
    it 'creates a new workout' do
      post '/api/v1/workouts', params: { workout: { name: 'New Workout', user_id: user.id }, exercises: [exercise.attributes] }
      expect(response).to have_http_status(200)
    end
  end

  describe 'POST /workouts/clone' do
    it 'clones an existing workout' do
      post '/api/v1/workouts/clone', params: { parent_id: workout.id, user_id: user.id }
      expect(response).to have_http_status(200)
    end
  end

  describe 'DELETE /workouts/:id' do
    it 'deletes an existing workout' do
      delete "/api/v1/workouts/#{workout.id}"
      expect(response).to have_http_status(200)
    end
  end
end
