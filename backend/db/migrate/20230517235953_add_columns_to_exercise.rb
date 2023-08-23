class AddColumnsToExercise < ActiveRecord::Migration[7.0]
  def change
    add_column :exercises, :body_part, :string
    add_column :exercises, :equipment, :string
    add_column :exercises, :gif_url, :string
    add_column :exercises, :target, :string
  end
end
