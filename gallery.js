const basketStorageKey = 'craftShopBasket';
const cards = [...document.querySelectorAll('.gallery-card')];
const searchInput = document.querySelector('#gallery-search-input');
const searchForm = document.querySelector('.gallery-search');
const searchStatus = document.querySelector('.search-status');
const emptyResults = document.querySelector('.empty-results');
const basketCount = document.querySelector('.basket-count');
const basketButton = document.querySelector('.basket-button');
const basketAnnouncement = document.querySelector('.basket-announcement');

function readBasket() {
	try {
		const basket = JSON.parse(localStorage.getItem(basketStorageKey) || '[]');
		return Array.isArray(basket) ? basket : [];
	} catch {
		return [];
	}
}
 
function saveBasket(basket) {
	try {
		localStorage.setItem(basketStorageKey, JSON.stringify(basket));
	} catch {
		return;
	}
}

function updateBasketCount() {
	const count = readBasket().reduce((total, item) => total + item.quantity, 0);
	basketCount.textContent = count;
	basketButton.setAttribute('aria-label', `Basket, ${count} ${count === 1 ? 'item' : 'items'}`);
}

function filterGallery() {
	const query = searchInput.value.trim().toLocaleLowerCase();
	let visibleCount = 0;

	for (const card of cards) {
		const matches = card.textContent.toLocaleLowerCase().includes(query)
			|| card.querySelector('img').alt.toLocaleLowerCase().includes(query);
		card.hidden = !matches;
		visibleCount += Number(matches);
	}

	searchStatus.textContent = query
		? `Showing ${visibleCount} of ${cards.length} pieces`
		: `Showing ${cards.length} pieces`;
	emptyResults.hidden = visibleCount !== 0;
}

function showBasket() {
	const basket = readBasket();
	basketAnnouncement.textContent = basket.length
		? `In your basket: ${basket.map(item => `${item.name} × ${item.quantity}`).join(', ')}.`
		: 'Your basket is empty.';
	basketAnnouncement.classList.add('is-visible');
	window.setTimeout(() => basketAnnouncement.classList.remove('is-visible'), 3000);
}

searchInput.addEventListener('input', filterGallery);
searchForm.addEventListener('reset', () => requestAnimationFrame(filterGallery));
basketButton.addEventListener('click', showBasket);

for (const card of cards) {
	const button = card.querySelector('.add-to-basket');
	button.addEventListener('click', () => {
		const basket = readBasket();
		const name = card.dataset.item;
		const existingItem = basket.find(item => item.name === name);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			basket.push({ name, quantity: 1 });
		}

		saveBasket(basket);
		updateBasketCount();
		button.textContent = 'Added to cart';
		button.classList.add('is-added');
		basketAnnouncement.textContent = `${name} added to your basket. ${basketCount.textContent} ${Number(basketCount.textContent) === 1 ? 'item' : 'items'} in basket.`;
		basketAnnouncement.classList.add('is-visible');
		window.setTimeout(() => {
			button.textContent = 'Add to cart';
			button.classList.remove('is-added');
			basketAnnouncement.classList.remove('is-visible');
		}, 2200);
	});
}

updateBasketCount();