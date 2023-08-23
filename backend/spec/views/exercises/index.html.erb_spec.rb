require 'rails_helper'

RSpec.describe "exercises/index", type: :view do
  before(:each) do
    assign(:exercises, [
      Exercise.create!(
        name: "Name",
        description: "MyText",
        sets: 2,
        reps: 3
      ),
      Exercise.create!(
        name: "Name",
        description: "MyText",
        sets: 2,
        reps: 3
      )
    ])
  end

  it "renders a list of exercises" do
    render
    assert_select "tr>td", text: "Name".to_s, count: 2
    assert_select "tr>td", text: "MyText".to_s, count: 2
    assert_select "tr>td", text: 2.to_s, count: 2
    assert_select "tr>td", text: 3.to_s, count: 2
  end
end
