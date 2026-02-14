let user = null;

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  alert('Token not found in URL');
  window.location.href = '/';
}


const eventSource = new EventSource(`/api/token/${token}`);

eventSource.onmessage = (event) => {
  const {
    user: fetchedUser,
    waitingUsers,
    completeUsers,
    ongoingUser,
  } = JSON.parse(event.data);

  user = fetchedUser;

  if (!user) {
    alert('User not found');
    window.location.href = '/';
    return;
  }


  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.className =
      'status ' + (user.status?.toLowerCase() || 'waiting');
    statusEl.innerText = user.status || '-';
  }

  document.getElementById('name').innerText = user.name || '-';
  document.getElementById('phone').innerText = user.phone_number || '-';
  document.getElementById('account').innerText = user.account_number || '-';
  document.getElementById('token').innerText = user.token_number || '-';
  document.getElementById('created_at').innerText = user.created_at
    ? new Date(user.created_at).toLocaleString()
    : '-';

 
  const completedEl = document.getElementById('completed');
  if (completedEl) {
    completedEl.innerHTML = completeUsers
      .map(
        (u) =>
          `<div class="tokens status completed">${u.token_number}</div>`
      )
      .join('');
  }

 
  const waitingEl = document.getElementById('waiting');
  if (waitingEl) {
    waitingEl.innerHTML = waitingUsers
      .map(
        (u) =>
          `<div class="tokens waiting">${u.token_number}</div>`
      )
      .join('');
  }

  
  const ongoingEl = document.getElementById('token_number');
  if (ongoingEl) {
    ongoingEl.innerText = ongoingUser
      ? ongoingUser.token_number
      : '-';
  }
};


eventSource.onerror = () => {
  console.error('SSE connection error');
  eventSource.close();
};

const cancelBooking = async () => {
  try {
    if (!user || !user.token_number) {
      return alert('No user token available');
    }

    await axios.post('/logout', { token_number: user.token_number });
    window.location.href = '/';
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert(error.response?.data?.message || 'Failed to logout');
  }
};