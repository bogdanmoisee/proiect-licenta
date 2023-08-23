require 'rails_helper'

RSpec.describe "exercises/edit", type: :view do
  before(:each) do
    @exercise = assign(:exercise, Exercise.create!(
      name: "MyString",
      description: "MyText",
      sets: 1,
      reps: 1
    ))
  end

  it "renders the edit exercise form" do
    render

    assert_select "form[action=?][method=?]", api_v1_exercise_path(@exercise), "post" do

      assert_select "input[name=?]", "exercise[name]"

      assert_select "textarea[name=?]", "exercise[description]"

      assert_select "input[name=?]", "exercise[sets]"

      assert_select "input[name=?]", "exercise[reps]"
    end
  end
end
