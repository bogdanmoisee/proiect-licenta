# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApiController
      before_action :doorkeeper_authorize!, only: %i[me show follow unfollow]
      before_action :current_user
      respond_to    :json

      # GET /users/me.json
      def me
        if current_user.nil?
          render json: { error: 'Not Authorized' }, status: :unauthorized
        else
          render json: {
            id: current_user.id,
            email: current_user.email,
            username: current_user.username,
            avatar_url: current_user.avatar_url,
            role: current_user.role,
            created_at: current_user.created_at.iso8601,
            followers: current_user.followers.count,
            following: current_user.following.count,
            workouts: current_user.self_workouts.count
          }, status: :ok
        end
      end

      # GET /users/:user_id
      def show
        user = User.find_by(id: params[:id])

        if user.nil?
          render json: { error: 'Not Found' }, status: :unprocessable_entity
        else
          render json: {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar_url: user.avatar_url,
            role: user.role,
            created_at: user.created_at.iso8601,
            followers: user.followers.count,
            following: user.following.count,
            workouts: user.self_workouts.count,
            is_followed: current_user&.following?(user)
          }, status: :ok
        end
      end

      # GET /users/:user_id/other_users
      def other_users
        current_user = User.find(params[:user_id])
        users = User.without(current_user)
        users_data = []
        users.each do |user|
          user_data = user.attributes
          user_data[:is_followed] = current_user.following?(user)
          users_data << user_data
        end
        render json: users_data, status: :ok
      end

      # GET /users/:user_id/following_users
      def following_users
        current_user = User.find(params[:current_user_id])
        user = User.find(params[:user_id])
        users = user.following.without(current_user)
        users_data = []
        users.each do |u|
          user_data = u.attributes
          user_data[:is_followed] = current_user.following?(u)
          users_data << user_data
        end
        render json: users_data, status: :ok
      end

      # POST /users/:id/follow
      def follow
        user = User.find(params[:id])
        current_user.follow(user)

        render json: { id: current_user.id, followed_id: user.id }, status: :ok
      end

      # POST /users/:id/unfollow
      def unfollow
        user = User.find(params[:id])
        current_user.unfollow(user)

        render json: { id: current_user.id, followed_id: user.id }, status: :ok
      end
    end
  end
end
