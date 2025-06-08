const API = 'https://qotd-api-ne8l.onrender.com/api';

export default {
  async daily() {
    const res = await fetch(`${API}/daily_quote`);
    return await res.json();
  },
  async random() {
    const res = await fetch(`${API}/random_quote`);
    return await res.json();
  },
};
