# frozen_string_literal: true

namespace :api do
  namespace :v1 do
    scope :users, module: :users do
      post '/', to: 'registrations#create', as: :user_registration
      patch '/', to: 'registrations#update_profile', as: :user_update_profile
    end

    get '/users/me', to: 'users#me'
    get '/users/:id', to: 'users#show'
    get '/users/:user_id/other-users', to: 'users#other_users'
    get '/users/:user_id/following-users', to: 'users#following_users'
    post 'users/:id/follow', to: 'users#follow'
    post 'users/:id/unfollow', to: 'users#unfollow'

    resources :exercises
    resources :workouts, defaults: { format: 'json' }
    get 'users/:user_id/workouts', to: 'workouts#user_workouts', defaults: { format: 'json' }
    get 'users/:user_id/following-workouts', to: 'workouts#user_following_workouts', defaults: { format: 'json' }
    post 'workouts/clone', to: 'workouts#clone', defaults: { format: 'json' }
    delete 'workouts/clone/:id', to: 'workouts#destroy_clone', defaults: { format: 'json' }
  end
end

scope :api do
  scope :v1 do
    # Swagger documentation
    scope :swagger do
      get '/', to: 'apidocs#index', as: :swagger_root
      get '/data', to: 'apidocs#data', as: :swagger_data
    end
    use_doorkeeper do
      skip_controllers :authorizations, :applications, :authorized_applications
    end
  end
end
