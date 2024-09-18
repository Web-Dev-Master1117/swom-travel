const getUnreadMessageCount = async (userId: string) => {
    const response = await fetch('/api/getUnread', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    });
  
    if (!response.ok) {
      throw new Error(`Error fetching unread messages count: ${response.statusText}`);
    }
  
    const data = await response.json();
    // console.log("the data you requested", data);
    return data.unreadCount;
  };

  export default getUnreadMessageCount;