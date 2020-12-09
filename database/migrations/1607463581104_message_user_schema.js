'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageUserSchema extends Schema {
  up () {
    this.create('message_user', (table) => {
      table.increments()
      table.integer('user_id').notNullable()
      table.integer('message_id').notNullable()
      table.string("type", 255).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('message_user')
  }
}

module.exports = MessageUserSchema
