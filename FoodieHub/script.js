const DEFAULT_FOODS = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:249,rating:4.8,time:"20-25 min",tag:"Bestseller",desc:"Classic cheese, basil and tomato sauce.",image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Crispy Chicken Burger",category:"Burgers",price:189,rating:4.7,time:"15-20 min",tag:"Popular",desc:"Crispy chicken, fresh lettuce and house sauce.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Creamy Alfredo Pasta",category:"Asian",price:229,rating:4.6,time:"20 min",tag:"Chef's pick",desc:"Creamy white sauce pasta with herbs.",image:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Chocolate Lava Cake",category:"Desserts",price:129,rating:4.9,time:"15 min",tag:"Sweet treat",desc:"Warm chocolate cake with a gooey centre.",image:"https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Loaded Pepperoni Pizza",category:"Pizza",price:329,rating:4.8,time:"25 min",tag:"Must try",desc:"Loaded with cheese and savoury toppings.",image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Classic Veg Burger",category:"Burgers",price:149,rating:4.5,time:"15 min",tag:"Value pick",desc:"A golden veggie patty with crunchy greens.",image:"https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Fresh Mango Smoothie",category:"Drinks",price:119,rating:4.7,time:"10 min",tag:"Fresh",desc:"A chilled, creamy mango favourite.",image:"https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Spicy Ramen Bowl",category:"Asian",price:279,rating:4.8,time:"25 min",tag:"Spicy",desc:"Rich broth, noodles and a little heat.",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80"}
];
const FOOD_KEY = "foodiehub-foods";
function loadFoods(){
  const saved = localStorage.getItem(FOOD_KEY);
  if(saved){
    try {
      const parsed = JSON.parse(saved);
      if(Array.isArray(parsed)) return parsed;
    } catch(error) { console.warn("Food menu data could not be read.", error); }
  }
  localStorage.setItem(FOOD_KEY, JSON.stringify(DEFAULT_FOODS));
  return [...DEFAULT_FOODS];
}
let foods = loadFoods();
let cart = JSON.parse(localStorage.getItem("foodiehub-cart") || "[]");
let activeCategory = "All";
const foodGrid = document.getElementById("foodGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function money(value){ return "₹" + Number(value).toLocaleString("en-IN"); }
function saveFoods(){ localStorage.setItem(FOOD_KEY, JSON.stringify(foods)); }
function saveCart(){ localStorage.setItem("foodiehub-cart", JSON.stringify(cart)); }
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function renderCategories(){
  const categories = ["All", ...new Set(foods.map(food => food.category).filter(Boolean))];
  if(!categories.includes(activeCategory)) activeCategory = "All";
  const icons = {All:"🍽️",Pizza:"🍕",Burgers:"🍔",Asian:"🍜",Desserts:"🍰",Drinks:"🥤"};
  document.getElementById("categoryList").innerHTML = categories.map(category =>
    `<button class="category-chip ${activeCategory===category?"selected":""}" data-category="${escapeHtml(category)}"><span>${icons[category]||"🍴"}</span>${escapeHtml(category==="All"?"All items":category)}</button>`
  ).join("");
}
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function renderFoods(){
  renderCategories();
  const term = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = foods.filter(food =>
    (activeCategory === "All" || food.category === activeCategory) &&
    (food.name.toLowerCase().includes(term) || (food.desc||"").toLowerCase().includes(term))
  );
  foodGrid.innerHTML = filtered.map(food => `
    <article class="food-card">
      <div class="food-image"><img src="${escapeHtml(food.image)}" alt="${escapeHtml(food.name)}" loading="lazy"><span class="food-tag">${escapeHtml(food.tag||"Fresh")}</span></div>
      <div class="food-info">
        <div class="food-meta"><span>${escapeHtml(food.category)} · ${escapeHtml(food.time||"Fresh")}</span><span class="food-rating">★ ${Number(food.rating||4.5).toFixed(1)}</span></div>
        <h3>${escapeHtml(food.name)}</h3><p class="food-desc">${escapeHtml(food.desc||"Freshly prepared with care.")}</p>
        <div class="food-bottom"><span class="food-price">${money(food.price)}</span><button class="add-btn" data-add="${Number(food.id)}">+ Add</button></div>
      </div>
    </article>`).join("");
  document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
}
function syncMenuFromStorage(){
  foods = loadFoods();
  renderFoods();
  renderCart();
}
function addToCart(id){
  const item = cart.find(row => row.id === id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); showToast("Added to your cart!");
}
function changeQty(id, amount){
  const item = cart.find(row => row.id === id);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0) cart = cart.filter(row => row.id !== id);
  saveCart(); renderCart();
}
function cartTotals(){
  const subtotal = cart.reduce((sum,row) => {
    const food = foods.find(item => item.id === row.id);
    return sum + (food ? Number(food.price) * row.qty : 0);
  },0);
  const delivery = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 30;
  return {subtotal,delivery,total:subtotal+delivery};
}
function renderCart(){
  cart = cart.filter(row => foods.some(food => food.id === row.id));
  saveCart();
  const count = cart.reduce((sum,row) => sum + row.qty,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  const items = document.getElementById("cartItems");
  if(cart.length === 0){
    items.innerHTML = '<div class="cart-empty"><span>🛍️</span><h3>Your cart is empty</h3><p>Add something delicious to get started.</p></div>';
  }else{
    items.innerHTML = cart.map(row => {
      const food = foods.find(item => item.id === row.id);
      return `<div class="cart-row"><img src="${escapeHtml(food.image)}" alt="${escapeHtml(food.name)}"><div><h4>${escapeHtml(food.name)}</h4><small>${money(food.price)} each</small><div class="qty-control"><button data-qty="${food.id}" data-change="-1">−</button><span>${row.qty}</span><button data-qty="${food.id}" data-change="1">+</button></div></div><span class="cart-row-price">${money(food.price*row.qty)}</span></div>`;
    }).join("");
  }
  const totals = cartTotals();
  document.getElementById("subtotal").textContent = money(totals.subtotal);
  document.getElementById("deliveryFee").textContent = totals.delivery === 0 && totals.subtotal > 0 ? "FREE" : money(totals.delivery);
  document.getElementById("total").textContent = money(totals.total);
  document.getElementById("checkoutTotal").textContent = money(totals.total);
  document.getElementById("checkoutBtn").disabled = cart.length === 0;
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");}
document.getElementById("categoryList").addEventListener("click",event=>{
  const button = event.target.closest("[data-category]");
  if(!button) return;
  activeCategory = button.dataset.category;
  renderFoods();
});
foodGrid.addEventListener("click",event=>{
  const button = event.target.closest("[data-add]");
  if(button) addToCart(Number(button.dataset.add));
});
document.getElementById("cartItems").addEventListener("click",event=>{
  const button = event.target.closest("[data-qty]");
  if(button) changeQty(Number(button.dataset.qty),Number(button.dataset.change));
});
document.getElementById("searchInput").addEventListener("input",renderFoods);
document.getElementById("searchFocus").addEventListener("click",()=>{
  document.getElementById("searchInput").focus();
  document.getElementById("menu").scrollIntoView({behavior:"smooth"});
});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("claimOffer").addEventListener("click",()=>{
  document.getElementById("menu").scrollIntoView({behavior:"smooth"});
  showToast("Pick your favourites and enjoy the offer!");
});
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  closeCart(); document.getElementById("checkoutModal").classList.add("show");
});
document.getElementById("closeCheckout").addEventListener("click",()=>document.getElementById("checkoutModal").classList.remove("show"));
document.getElementById("checkoutModal").addEventListener("click",event=>{
  if(event.target.id==="checkoutModal") event.currentTarget.classList.remove("show");
});
document.getElementById("checkoutForm").addEventListener("submit",event=>{
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const orderId = "FH" + Math.floor(100000 + Math.random()*900000);
  const order = {orderId,customer:form.get("customerName"),phone:form.get("phone"),address:form.get("address"),payment:form.get("payment"),items:cart.map(row=>({...row})),total:cartTotals().total,createdAt:new Date().toISOString()};
  const orders = JSON.parse(localStorage.getItem("foodiehub-orders") || "[]");
  orders.push(order); localStorage.setItem("foodiehub-orders",JSON.stringify(orders));
  cart=[]; saveCart(); renderCart();
  document.getElementById("checkoutModal").classList.remove("show");
  event.currentTarget.reset();
  showToast(`Order placed! Your demo order ID is ${orderId}`);
});
window.addEventListener("storage", event => {
  if(event.key === FOOD_KEY) syncMenuFromStorage();
});
window.addEventListener("pageshow", syncMenuFromStorage);
window.addEventListener("focus", syncMenuFromStorage);
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("mobileMenuBtn").addEventListener("click",()=>document.getElementById("menu").scrollIntoView({behavior:"smooth"}));
renderFoods(); renderCart();