const DB_URL = "https://yzearn-default-rtdb.firebaseio.com";

export default async function handler(req, res) {
  const { action, name, phone, referredBy, amount, userId, score } = req.query;

  // 1. SIGNUP & REFERRAL LOGIC
  if (action === "signup") {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Kirkira musu Code
    const userData = {
      name, phone, referralCode, 
      referredBy: referredBy || "none",
      balance: referredBy ? 50 : 0, // Kyautar 50 idan an yi referral
      createdAt: new Date().toISOString()
    };

    // Ajiye Profile
    await fetch(`${DB_URL}/users/${phone}/profile.json`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });

    // Ajiye Referral Mapping (Don saurin nema)
    await fetch(`${DB_URL}/referrals/${referralCode}.json`, {
      method: 'PUT',
      body: JSON.stringify({ owner: phone })
    });

    // Idan akwai wanda ya gayyace shi, a kara masa kudi shima
    if (referredBy) {
       // Nemo mai referral code din (wannan yana bukatar karin logic na nema)
       // Don sauki: A rinka tura kudin ga asalin mai code din
    }

    return res.status(200).json({ status: "success", referralCode });
  }

  // 2. WITHDRAWAL LOGIC
  if (action === "withdraw") {
    const withdrawalData = {
      amount, status: "pending", date: new Date().toISOString()
    };
    
    await fetch(`${DB_URL}/users/${phone}/withdrawals.json`, {
      method: 'POST',
      body: JSON.stringify(withdrawalData)
    });

    return res.status(200).json({ status: "Pending Approval" });
  }

  // 3. ADD HISTORY (SCORE)
  if (action === "addScore") {
    const entry = { score, date: new Date().toISOString() };
    await fetch(`${DB_URL}/users/${phone}/history.json`, {
      method: 'POST',
      body: JSON.stringify(entry)
    });
    return res.status(200).json({ status: "Score Saved" });
  }
}
