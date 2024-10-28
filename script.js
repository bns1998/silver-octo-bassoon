const ordersTableBody = document.getElementById('ordersTableBody');
const totalPriceWithoutDeliveryElement = document.getElementById('totalPriceWithoutDelivery');
const totalPriceWithDeliveryElement = document.getElementById('totalPriceWithDelivery');
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// استرجاع الطلبات المخزنة عند تحميل الصفحة
window.onload = function() {
    updateTable();
};

function isValidInput(orderNumber, totalPrice) {
    const orderNumberValid = /^[0-9]+$/.test(orderNumber);
    const totalPriceValid = Number.isInteger(totalPrice) && totalPrice > 0;

    return orderNumberValid && totalPriceValid;
}

function addOrder(deliveryPrice) {
    const orderNumber = document.getElementById('orderNumber').value;
    const totalPrice = parseInt(document.getElementById('totalPrice').value, 10);

    if (!isValidInput(orderNumber, totalPrice)) {
        alert('يرجى التأكد من إدخال رقم الطلب والسعر الكلي بشكل صحيح.');
        return;
    }

    if (orders.some(order => order.number === orderNumber)) {
        alert('رقم الطلب موجود بالفعل.');
        return;
    }

    const priceWithoutDelivery = totalPrice - deliveryPrice;
    const newOrder = { number: orderNumber, totalPrice, deliveryPrice, priceWithoutDelivery };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    updateTable();
    document.getElementById('orderNumber').value = '';
    document.getElementById('totalPrice').value = '';
}

function updateTable() {
    ordersTableBody.innerHTML = '';
    let totalWithoutDelivery = 0;
    let totalWithDelivery = 0;

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.number}</td>
            <td>${order.totalPrice}</td>
            <td>${order.deliveryPrice}</td>
            <td>${order.priceWithoutDelivery}</td>
            <td><button onclick="removeOrder(${index})">مسح</button></td> <!-- زر المسح -->
        `;
        ordersTableBody.appendChild(row);
        totalWithoutDelivery += order.priceWithoutDelivery;
        totalWithDelivery += order.totalPrice;
    });

    totalPriceWithoutDeliveryElement.textContent = totalWithoutDelivery;
    totalPriceWithDeliveryElement.textContent = totalWithDelivery;
}

function removeOrder(index) {
    const confirmRemove = confirm('هل أنت متأكد أنك تريد مسح هذا الطلب؟');
    if (confirmRemove) {
        orders.splice(index, 1); // إزالة الطلب من المصفوفة
        localStorage.setItem('orders', JSON.stringify(orders));
        updateTable(); // تحديث الجدول
    }
}

function clearOrders() {
    const confirmClear = confirm('هل أنت متأكد أنك تريد مسح السجل؟');
    if (confirmClear) {
        orders = [];
        localStorage.removeItem('orders');
        updateTable();
    }
}

function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الطلبات");
    XLSX.writeFile(wb, "الطلبات.xlsx");
}
