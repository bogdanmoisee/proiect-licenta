# frozen_string_literal: true

Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  root 'pages#home'

  use_doorkeeper
  devise_for :users

  draw :api
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
end
