import React, { useState, useEffect } from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig'
import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/AuthContext'
const Room = () => {

    const { user } = useAuth()

    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('')

    useEffect(() => {
        getMessages()
        const unsubscribe = client.subscribe([`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`], (response) => {
            // console.log(response);

            if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
                setMessages((prev) => prev.filter((message) => message.$id !== response.payload.$id));
            }

            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                setMessages((prev) => [response.payload, ...prev]);
            }
        })

        return () => unsubscribe();
        
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody

        }
        let permissions = [
            Permission.write(Role.user(user.$id))
        ]
        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions

        )
        console.log('MESSAGE_ID:', response.$id)
        // console.log('created',response)
        // setMessages(prevState=>[response,...prevState])
        setMessageBody('')
    }

    const getMessages = async () => {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(5)
            ]
        )
         
        setMessages(response.documents)
    }

    // const deleteMessage = async(message_id)=>{

    //     databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id)
    // }
    const deleteMessage = async (message_id) => {
        console.log('Deleting message with ID:', message_id);

        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);

            // Update the messages state to remove the deleted message
            // setMessages((prevState) => prevState.filter((message) => message.$id !== message_id));
            // console.log('deleted message with id ',message_id)
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }


    return (
        <main className='container'>
            <Header />
            <div className='room--container'>

                <form onSubmit={handleSubmit} id='message--form'>
                    <div>
                        <textarea required
                            maxLength='1000'
                            placeholder='say something'
                            onChange={(e) => { setMessageBody(e.target.value) }}
                            value={messageBody}
                        >

                        </textarea>
                        <div className='send-btn--wrapper'>
                            <input type='submit' value='send' className='btn btn--secondary' />
                        </div>
                    </div>
                </form>
                <div>
                    {messages.map(message => (
                        <div key={message.$id} className='message--wrapper'>
                            <div className={`message--header ${message.user_id === user.$id ? 'right' :''}`}>
                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        <span>'Anonymous user'</span>
                                    )}
                                    <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>

                                </p>

                                {message.$permissions.includes(`delete("user:${user.$id}")`) && (
                                    <Trash2 onClick={() => { deleteMessage(message.$id) }}
                                        className='delete--btn'

                                    />

                                )}

                            </div>

                            <div className={`right  ${message.user_id === user.$id ? '' : 'shift-right'}`}>
                                <div className={`message--body ${message.user_id === user.$id ? 'own-user2' : 'other-user2'} `}>
                                    <span>{message.body}</span>
                                </div>
                            </div>

                            {/* <div className='right'>
                                  <div className='message--body'><span>{message.body}</span></div>
                            </div> */}

                        
                        </div>

                    ))}
                </div>
            </div>
        </main>
    )
}

export default Room