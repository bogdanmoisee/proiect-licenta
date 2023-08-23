class CreateExercises < ActiveRecord::Migration[7.0]
  def change
    create_table :exercises do |t|
      t.string :name
      t.text :description
      t.integer :sets
      t.integer :reps

      t.timestamps
    end
  end
end
