const ADMIN_CREDENTIALS = {
  userId: "admin",
  password: "foodie@123"
};
const AUTH_SESSION_KEY = "foodiehub-admin-auth";

const loginWrap = document.getElementById("adminLoginWrap");
const adminMain = document.getElementById("adminMain");
const logoutBtn = document.getElementById("logoutBtn");
const loginForm = document.getElementById("adminLoginForm");
const loginError = document.getElementById("loginError");

function checkAdminAuth(){
  const isAuthenticated = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
  loginWrap.classList.toggle("hidden", isAuthenticated);
  adminMain.classList.toggle("hidden", !isAuthenticated);
  logoutBtn.classList.toggle("hidden", !isAuthenticated);
}

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const enteredId = document.getElementById("adminUserId").value.trim();
  const enteredPass = document.getElementById("adminPassword").value;
  if(enteredId === ADMIN_CREDENTIALS.userId && enteredPass === ADMIN_CREDENTIALS.password){
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    loginError.textContent = "";
    loginForm.reset();
    checkAdminAuth();
    renderList();
  } else {
    loginError.textContent = "Invalid User ID or Password. Please try again.";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  checkAdminAuth();
});

const FOOD_KEY = "foodiehub-foods";
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
let foods = loadFoods();
let selectedImageData = "";
const form = document.getElementById("foodForm");
const imageInput = document.getElementById("foodImage");
const fileInput = document.getElementById("foodImageFile");
const preview = document.getElementById("imagePreview");
function loadFoods(){
  try{
    const saved = localStorage.getItem(FOOD_KEY);
    if(saved) return JSON.parse(saved);
  }catch(error){console.warn(error);}
  localStorage.setItem(FOOD_KEY,JSON.stringify(DEFAULT_FOODS));
  return [...DEFAULT_FOODS];
}
function saveFoods(){localStorage.setItem(FOOD_KEY,JSON.stringify(foods));}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function renderList(){
  document.getElementById("itemCount").textContent=foods.length;
  document.getElementById("adminFoodList").innerHTML=foods.length?foods.map(food=>`
    <div class="admin-food-row">
      <img src="${escapeHtml(food.image||"")}" alt="${escapeHtml(food.name)}">
      <div><h3>${escapeHtml(food.name)}</h3><p>${escapeHtml(food.category)} · ${escapeHtml(food.time||"Fresh")}</p></div>
      <div><strong>₹${Number(food.price).toLocaleString("en-IN")}</strong><div class="row-actions"><button class="edit-item" data-edit="${food.id}">Edit</button><button class="delete-item" data-delete="${food.id}">Delete</button></div></div>
    </div>`).join(""):'<div class="no-items">No food items yet. Add your first dish using the form.</div>';
  const categories=[...new Set(foods.map(food=>food.category))];
  document.getElementById("categoryOptions").innerHTML=categories.map(cat=>`<option value="${escapeHtml(cat)}"></option>`).join("");
}
function resetForm(){
  form.reset();
  document.getElementById("foodId").value="";
  selectedImageData="";
  preview.innerHTML="<span>🍽️</span><small>Image preview</small>";
  document.getElementById("formEyebrow").textContent="NEW MENU ITEM";
  document.getElementById("formTitle").textContent="Add a food item";
  document.getElementById("saveFoodBtn").innerHTML='Add food item <span>→</span>';
  document.getElementById("cancelEdit").classList.add("hidden");
}
function showPreview(src){
  if(src) preview.innerHTML=`<img src="${src}" alt="Food image preview">`;
  else preview.innerHTML="<span>🍽️</span><small>Image preview</small>";
}
imageInput.addEventListener("input",()=>{
  selectedImageData="";
  showPreview(imageInput.value.trim());
});
fileInput.addEventListener("change",()=>{
  const file=fileInput.files[0];
  if(!file) return;
  if(file.size>1.5*1024*1024){
    alert("Please choose an image smaller than 1.5 MB.");
    fileInput.value="";
    return;
  }
  const reader=new FileReader();
  reader.onload=()=>{
    selectedImageData=reader.result;
    imageInput.value="";
    showPreview(selectedImageData);
  };
  reader.readAsDataURL(file);
});
form.addEventListener("submit",event=>{
  event.preventDefault();
  const idValue=document.getElementById("foodId").value;
  const existing=idValue?foods.find(food=>food.id===Number(idValue)):null;
  const image=selectedImageData || imageInput.value.trim() || (existing?existing.image:"");
  if(!image){
    alert("Please add an image URL or upload a food image.");
    return;
  }
  const item={
    id:existing?existing.id:Date.now(),
    name:document.getElementById("foodName").value.trim(),
    category:document.getElementById("foodCategory").value.trim(),
    price:Number(document.getElementById("foodPrice").value),
    rating:existing?existing.rating:4.7,
    time:document.getElementById("foodTime").value.trim()||"20-25 min",
    tag:document.getElementById("foodTag").value.trim()||"Fresh",
    desc:document.getElementById("foodDesc").value.trim()||"Freshly prepared with care.",
    image
  };
  if(existing) foods=foods.map(food=>food.id===existing.id?item:food);
  else foods.push(item);
  saveFoods();renderList();resetForm();
  document.getElementById("adminMessage").textContent=existing?"Food item updated successfully!":"New food item added successfully!";
});
document.getElementById("adminFoodList").addEventListener("click",event=>{
  const editButton=event.target.closest("[data-edit]");
  const deleteButton=event.target.closest("[data-delete]");
  if(editButton){
    const food=foods.find(item=>item.id===Number(editButton.dataset.edit));
    if(!food) return;
    document.getElementById("foodId").value=food.id;
    document.getElementById("foodName").value=food.name;
    document.getElementById("foodPrice").value=food.price;
    document.getElementById("foodCategory").value=food.category;
    document.getElementById("foodImage").value=food.image.startsWith("data:")?"":food.image;
    document.getElementById("foodDesc").value=food.desc||"";
    document.getElementById("foodTime").value=food.time||"";
    document.getElementById("foodTag").value=food.tag||"";
    selectedImageData=food.image.startsWith("data:")?food.image:"";
    showPreview(food.image);
    document.getElementById("formEyebrow").textContent="EDIT MENU ITEM";
    document.getElementById("formTitle").textContent="Update food item";
    document.getElementById("saveFoodBtn").innerHTML='Save changes <span>→</span>';
    document.getElementById("cancelEdit").classList.remove("hidden");
    document.getElementById("adminMessage").textContent="";
    window.scrollTo({top:0,behavior:"smooth"});
  }
  if(deleteButton){
    const id=Number(deleteButton.dataset.delete);
    const food=foods.find(item=>item.id===id);
    if(!food||!confirm(`Delete "${food.name}" from your menu?`)) return;
    foods=foods.filter(item=>item.id!==id);
    saveFoods();renderList();
    document.getElementById("adminMessage").textContent="Food item deleted.";
  }
});
document.getElementById("cancelEdit").addEventListener("click",resetForm);
document.getElementById("restoreDefaults").addEventListener("click",()=>{
  if(!confirm("Restore the original sample menu? Your custom menu items will be replaced.")) return;
  foods=DEFAULT_FOODS.map(food=>({...food}));
  saveFoods();renderList();resetForm();
  document.getElementById("adminMessage").textContent="Sample menu restored.";
});

checkAdminAuth();
renderList();