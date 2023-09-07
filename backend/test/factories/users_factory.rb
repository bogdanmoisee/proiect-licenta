FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    username { Faker::Internet.username(specifier: 5..8) }
    password { Faker::Internet.password(min_length: 8) }
    reset_password_token { Faker::Internet.uuid }
    reset_password_sent_at { Faker::Time.between_dates(from: Date.today - 1, to: Date.today, period: :all) }
    remember_created_at { Faker::Time.between_dates(from: Date.today - 1, to: Date.today, period: :all) }
    created_at { Faker::Time.between_dates(from: Date.today - 30, to: Date.today, period: :all) }
    updated_at { created_at }
    avatar_url { Faker::Avatar.image(slug: username, size: '100x400', format: 'png') }

    # Generate a dummy access_token for the purpose of testing.
    # This is assuming that User model has a method `access_token`
    # that returns a valid token.
    transient do
      access_token { "Bearer_#{Faker::Alphanumeric.alphanumeric(number: 20)}" }
    end
  end
end
