import MySqlConnection from 'react-native-my-sql-connection';

let config = {
    host:'localhost',
    database:'appointment-app',
    user:'root',
    password:'root'
}

export const executeQuery = async (query: string) => {
    try {
        const connection = await MySqlConnection.createConnection(config)
        let res = await connection.executeQuery(query)
        connection.close()
        return res
    } catch(err){
        console.log(`Executing query failed with error: ${err}`)
        // return err
    }
}