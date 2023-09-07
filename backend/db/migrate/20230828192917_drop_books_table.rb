class DropBooksTable < ActiveRecord::Migration[7.0]
  def up
    drop_table :books
  end

  def down
    create_table :books do |t|
      t.string 'title'
      t.text 'body'
      t.datetime 'created_at', null: false
      t.datetime 'updated_at', null: false
    end
  end
end
