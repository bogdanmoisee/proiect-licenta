FactoryBot.define do
  factory :exercise do
    name { 'Push Up' }
    description { 'A basic push-up exercise.' }
    created_at { Time.now }
    updated_at { Time.now }
    body_part { 'Chest' }
    equipment { 'None' }
    gif_url { 'https://example.com/gif_url.gif' }
    target { 'Muscle Gain' }
  end
end
