# FoodieHub – Online Food Ordering System

FoodieHub is a frontend-based online food ordering website developed as a college project. It allows users to explore different food items, search for dishes, add items to their cart and place demo orders.

The project also includes an admin panel where food items can be added, updated or deleted.

## Admin Login Details

To access the Manage Menu section, use the following login details:

- **User ID:** `admin`
- **Password:** `foodie@123`

## How to Run the Project

1. Download or extract the `FoodieHub_Project.zip` file.
2. Open the extracted `FoodieHub` folder in VS Code.
3. Install the **Live Server** extension by Ritwick Dey.
4. Open the `index.html` file.
5. Right-click and select **Open with Live Server**.
6. The website will open in your browser.
7. To manage food items, click on **Manage Menu** or open `admin.html` directly.

## Adding Food Items

The admin can add new food items by following these steps:

1. Open `admin.html` and log in.
2. Enter the food name, price and category.
3. Add an image URL or upload an image (maximum size: 1.5 MB).
4. Click on **Add Food Item**.
5. Go back to the home page to see the updated menu.

## Editing and Deleting Food Items

- **Edit:** Used to update food details such as name, price, category, description, preparation time, tag and image.
- **Delete:** Used to remove a food item from the menu.
- **Restore Sample Menu:** Brings back the original sample food items.

## Main Features

- Simple and responsive restaurant website design.
- Admin login system with a logout option.
- Add, edit and delete food items.
- Create new food categories.
- Search food items by name.
- Filter food items by category.
- Add food items to the shopping cart.
- Increase or decrease food quantities.
- Automatic total bill calculation.
- Demo checkout form and order confirmation.
- Menu and cart data saved using LocalStorage.

## Technologies Used

- **HTML** – Website structure.
- **CSS** – Website design and layout.
- **JavaScript** – Website functionality.
- **jQuery** – Interactive features.
- **Bootstrap** – Responsive design.
- **LocalStorage** – Stores menu and cart information in the browser.

## Project Limitations

This project is developed only for frontend demonstration and academic purposes. It does not have a real backend or database.

Menu items, cart details and demo orders are stored in the browser's LocalStorage. Admin login information is handled using sessionStorage and client-side validation.

Therefore, changes made on one browser or device are not automatically available on other devices. A backend and database will be required to make this a fully functional online food ordering website.

## Project Purpose

The main purpose of this project is to understand how frontend technologies work together to develop an online food ordering website and how users and admins can interact with it.