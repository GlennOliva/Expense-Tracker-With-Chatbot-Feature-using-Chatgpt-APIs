import  {  useState } from 'react';
import '../css/chats.css';
import logo from '../images/gamcologo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
  
  

const Chats = () => {

 
 
      
 
    const navigate = useNavigate();
     const handleLogout = () =>{
         navigate('/login')
     }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  const { getUserEmail } = useAuth();
  const userEmail = getUserEmail();
  const [typing, setTyping] = useState(false);

 // Adjust the 'position' property type in your MessageModel
interface MessageModel {
  author: string;
  message: string;
  direction: 'incoming' | 'outgoing';
  position: 0 | 1 | 2 | 3 | 'single' | 'first' | 'last' | 'normal'; // Align with the library's expected type
}

// ...

const [messages, setMessages] = useState<MessageModel[]>([
  {
    author: 'GAMCO BOT',
    message: 'Hello I am GAMCO Chatbot',
    direction: 'incoming',
    position: 'single', // or 'first', 'last', 'normal'
  },
]);

const handleSend = async (message: any) => {
  const newMessage: MessageModel = {
    author: 'user',
    message: message,
    direction: 'outgoing',
    position: 'single',
  };

  const newMessages: MessageModel[] = [...messages, newMessage];

  setMessages(newMessages);

  setTyping(true);

  if (newMessages.length > 0) {
    await processMessageToChatBot(newMessages);
  }
};





  
const API_KEY = "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";


async function processMessageToChatBot(chatMessages: any[]) {
  // Extracting user messages
  const userMessages = chatMessages.filter((messageObject) => messageObject.sender !== "GAMCOBOT");

  // Keywords related to finance
  const financeKeywords = ["finance", "budget", "investment", "savings", "expenses"];

  // Check if any user message contains finance-related keywords
  const isFinanceRelated = userMessages.some((messageObject) => {
    const lowercasedMessage = messageObject.message.toLowerCase();
    return financeKeywords.some((keyword) => lowercasedMessage.includes(keyword));
  });

  if (!isFinanceRelated) {
    // If not related to finance, send a system message
    setMessages([
      ...chatMessages,
      {
        message: "Sorry, GAMCO BOT can't provide information because it's not related to finance.",
        sender: "GAMCOBOT",
      },
    ]);
    setTyping(false);
    return;
  }

  // Prepare API messages, including the system message
  const apiMessages = userMessages.map((messageObject: { sender: string; message: any }) => ({
    role: "user",
    content: messageObject.message,
  }));

  const systemMessage = {
    role: "system",
    content: "Explain financial concepts as if I'm 20 years old.",
  };

  // Combine system message and user messages for API request
  const apiRequestBody = {
    model: "gpt-3.5-turbo",
    messages: [systemMessage, ...apiMessages],
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    const data = await response.json();
    console.log(data);

    // Update the chat with the response from GAMCO BOT
    setMessages([
      ...chatMessages,
      {
        message: data.choices[0].message.content,
        sender: "GAMCOBOT",
      },
    ]);

    setTyping(false);
  } catch (error) {
    console.error("Error processing message:", error);
    // Handle errors appropriately
  }
}


  
  

  return (
    <div>
     
     <div className="grid-container">

{/* <!-- Header --> */}
<header className="header">
        <div className="menu-icon" onClick={openSidebar}>
          <span className="material-icons-outlined">menu</span>
        </div>
        <div className="header-left"></div>
        <div className="header-right">
          {/* Display the user's email */}
          <h1 style={{ fontSize: '16px' }}>email: {userEmail}</h1>
        </div>
      </header>
{/* <!-- End Header -->

<!-- Sidebar --> */}
<aside id="sidebar" className={sidebarOpen ? 'sidebar-responsive' : ''}>
  <div className="sidebar-title">
    <div className="sidebar-brand">
    <div className="sidebar-brand">
  <img src={logo} style={{width: '105%' }} alt="GAMCO Logo" />
</div>
    </div>
    <span className="material-icons-outlined" onClick={closeSidebar}>
      close
    </span>

  </div>

  <ul className="sidebar-list">
    <li className="sidebar-list-item">
    <Link to="/dashboard">
        <span className="material-icons-outlined">dashboard</span> Dashboard
    </Link>
    </li>
    <li className="sidebar-list-item">
      <Link to="/expenses">
        <span className="material-icons-outlined">shopping_bag</span> Expenses
      </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/income">
        <span className="material-icons-outlined">payments</span> Income
    </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/savings">
        <span className="material-icons-outlined">credit_card</span> Savings
     </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/budget">
        <span className="material-icons-outlined">account_balance_wallet</span> Budget
     </Link>
    </li>
    <li className="sidebar-list-item">
    <Link to="/investment">
        <span className="material-icons-outlined">trending_up</span> Investments
    </Link>
    </li>

    <li className="sidebar-list-item">
    <Link to="/chats">
        <span className="material-icons-outlined">chat</span> Chat_Support
    </Link>
    </li>
   
    <li className="sidebar-list-item">
    <span className="material-icons-outlined" onClick={handleLogout}>logout</span> Logout
    </li>
  </ul>
</aside>
{/* <!-- End Sidebar -->

<!-- Main --> */}
  <main className="main-container">
      <div className="main-title">
        <p className="font-weight-bold">Chat Support</p>
      </div>



      <div style={{ position: 'relative', height: '500px', width: '1200px' }}>
            <MainContainer>
              <ChatContainer>
                <MessageList 
                scrollBehavior='smooth'
                typingIndicator={typing ? <TypingIndicator content="GAMCO BOT is typing" /> : null}>
                  {messages.map((message, i) => {
                    return <Message key={i} model={message} />;
                  })}
                </MessageList>
                <MessageInput  placeholder='Type a message on here!' onSend={handleSend}/>
              </ChatContainer>
            </MainContainer>
          </div>


    </main>
{/* <!-- End Main --> */}

</div>





    </div>
  )
}


export default Chats
