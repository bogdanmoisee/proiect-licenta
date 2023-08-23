require 'rails_helper'

RSpec.describe "exercises/new", type: :view do
  before(:each) do
    assign(:exercise, Exercise.new(
      name: "MyString",
      description: "MyText",
      sets: 1,
      reps: 1
    ))
  end

  it "renders new exercise form" do
    render

    assert_select "form[action=?][method=?]", api_v1_exercises_path, "post" do

      assert_select "input[name=?]", "exercise[name]"

      assert_select "textarea[name=?]", "exercise[description]"

      assert_select "input[name=?]", "exercise[sets]"

      assert_select "input[name=?]", "exercise[reps]"
    end
  end
end
