document.addEventListener('DOMContentLoaded', function() {
            const products = JSON.parse(localStorage.getItem('products')) || [
                {
                    id: 1,
                    name: 'Kis méretű utánfutó',
                    description: 'Ideális kisebb teher szállításához, könnyű kezelhetőség.',
                    price: 150000,
                    image: 'utanfuto.jpg'
                },
                {
                    id: 2,
                    name: 'Közepes utánfutó',
                    description: 'Nagy rakterrel, fedéllel ellátva, időjárásálló anyagokból.',
                    price: 250000,
                    image: 'utanfuto2.jpg'
                },
                {
                    id: 3,
                    name: 'Nagy teherbírású utánfutó',
                    description: 'Nehéz terhek szállításához, hidraulikus fékrendszerrel.',
                    price: 450000,
                    image: 'utanfuto3.jpg'
                },
                {
                    id: 4,
                    name: 'Hajó utánfutó',
                    description: 'Speciálisan hajó szállítására tervezve, korrózióálló anyagokból.',
                    price: 600000,
                    image: 'utanfuto4.jpg'
                }
            ];

            if (!localStorage.getItem('products')) {
                localStorage.setItem('products', JSON.stringify(products));
            }

            const imageExtRegex = /\.(jpe?g|png|gif)$/i;
            let migrated = false;
            products.forEach(p => {
                if (!imageExtRegex.test(p.image || '')) {
                    const ic = (p.image || '').toLowerCase();
                    if (ic.includes('trailer')) p.image = 'utanfuto.jpg';
                    else if (ic.includes('truck')) p.image = 'utanfuto2.jpg';
                    else if (ic.includes('caravan')) p.image = 'utanfuto3.jpg';
                    else if (ic.includes('ship')) p.image = 'utanfuto4.jpg';
                    migrated = true;
                }
            });
            if (migrated) {
                localStorage.setItem('products', JSON.stringify(products));
            }

            const modal = document.getElementById('product-modal');
            const addProductBtn = document.getElementById('add-product-btn');
            const closeModalBtns = document.querySelectorAll('.close-modal');
            const productForm = document.getElementById('product-form');
            const deleteProductBtn = document.getElementById('delete-product-btn');
            const modalTitle = document.getElementById('modal-title');
            const productsContainer = document.getElementById('products-container');

            const iconChoices = document.querySelectorAll('.icon-choice');
            const productImageInput = document.getElementById('product-image');
            const productIconInput = document.getElementById('product-icon');
            iconChoices.forEach(btn => {
                btn.addEventListener('click', function() {
                    iconChoices.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    productImageInput.value = this.getAttribute('data-image');
                    productIconInput.value = this.getAttribute('data-icon');
                });
            });
            if ((!productImageInput.value || productImageInput.value === '') && iconChoices.length) {
                iconChoices[0].classList.add('active');
                productImageInput.value = iconChoices[0].getAttribute('data-image');
                productIconInput.value = iconChoices[0].getAttribute('data-icon');
            }

            let currentProductId = null;

            addProductBtn.addEventListener('click', () => {
                currentProductId = null;
                modalTitle.textContent = 'Új termék hozzáadása';
                document.getElementById('product-form').reset();
                // Reset icon selection to first
                iconChoices.forEach((b, i) => b.classList.toggle('active', i === 0));
                productImageInput.value = document.querySelector('.icon-choice.active').getAttribute('data-image');
                productIconInput.value = document.querySelector('.icon-choice.active').getAttribute('data-icon');
                deleteProductBtn.style.display = 'none';
                modal.classList.add('active');
            });

            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });

            productForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const selectedIcon = document.getElementById('product-icon').value || '';
                const selectedImageFile = document.getElementById('product-image').value || '';
                const finalImageValue = selectedIcon !== '' ? selectedIcon : selectedImageFile;

                const productData = {
                    id: currentProductId || Date.now(),
                    name: document.getElementById('product-name').value,
                    description: document.getElementById('product-description').value,
                    price: parseInt(document.getElementById('product-price').value) || 0,
                    image: finalImageValue
                };

                const storedProducts = JSON.parse(localStorage.getItem('products')) || [];

                if (currentProductId) {
                    const index = storedProducts.findIndex(p => p.id === currentProductId);
                    if (index !== -1) {
                        storedProducts[index] = productData;
                    }
                } else {
                    storedProducts.push(productData);
                }

                localStorage.setItem('products', JSON.stringify(storedProducts));
                modal.classList.remove('active');
                loadProducts();
            });

            deleteProductBtn.addEventListener('click', () => {
                if (currentProductId && confirm('Biztosan törölni szeretné ezt a terméket?')) {
                    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                    const updatedProducts = storedProducts.filter(p => p.id !== currentProductId);
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    modal.classList.remove('active');
                    loadProducts();
                }
            });

            function isImagePath(path) {
                return /\.(jpe?g|png|gif)$/i.test(path || '');
            }

            function loadProducts() {
                const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                productsContainer.innerHTML = '';

                if (storedProducts.length === 0) {
                    productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; background-color: white; border-radius: 8px;">Jelenleg nincsenek termékek. Adjon hozzá újat!</p>';
                    return;
                }

                storedProducts.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    let imageOrIconMarkup = '';
                    if (isImagePath(product.image)) {
                        imageOrIconMarkup = `<div class="product-image"><img src="${product.image}" alt="${product.name}"></div>`;
                    } else {
                        // treat product.image as an icon class
                        imageOrIconMarkup = `<div class="product-image icon"><i class="${product.image}"></i></div>`;
                    }

                    productCard.innerHTML = `
                        ${imageOrIconMarkup}
                        <div class="product-content">
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-description">${product.description}</p>
                            <div class="product-price">${product.price.toLocaleString()} Ft</div>
                            <div class="product-actions">
                                <button class="btn edit-product-btn" data-id="${product.id}">
                                    <i class="fas fa-edit"></i> Szerkesztés
                                </button>
                                <button class="btn btn-delete delete-product-card-btn" data-id="${product.id}">
                                    <i class="fas fa-trash"></i> Törlés
                                </button>
                            </div>
                        </div>
                    `;

                    productsContainer.appendChild(productCard);
                });

                document.querySelectorAll('.edit-product-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-id'));
                        editProduct(productId);
                    });
                });

                document.querySelectorAll('.delete-product-card-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const productId = parseInt(this.getAttribute('data-id'));
                        deleteProductDirectly(productId);
                    });
                });
            }

            function editProduct(productId) {
                const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                const product = storedProducts.find(p => p.id === productId);

                if (product) {
                    currentProductId = productId;
                    modalTitle.textContent = 'Termék szerkesztése';
                    document.getElementById('product-name').value = product.name;
                    document.getElementById('product-description').value = product.description;
                    document.getElementById('product-price').value = product.price;
                    if (isImagePath(product.image)) {
                        document.getElementById('product-image').value = product.image || ''; 
                        document.getElementById('product-icon').value = '';
                        document.querySelectorAll('.icon-choice').forEach(b => {
                            const active = b.getAttribute('data-image') === product.image;
                            b.classList.toggle('active', active);
                            if (active) {
                                productImageInput.value = b.getAttribute('data-image') || '';
                                productIconInput.value = b.getAttribute('data-icon') || '';
                            }
                        });
                    } else {
                        document.getElementById('product-image').value = '';
                        document.getElementById('product-icon').value = product.image || '';
                        document.querySelectorAll('.icon-choice').forEach(b => {
                            const active = b.getAttribute('data-icon') === product.image;
                            b.classList.toggle('active', active);
                            if (active) {
                                productImageInput.value = b.getAttribute('data-image') || '';
                                productIconInput.value = b.getAttribute('data-icon') || '';
                            }
                        });
                    }
                    if (!productImageInput.value) productImageInput.value = 'utanfuto.jpg';
                    document.getElementById('product-id').value = productId;
                    deleteProductBtn.style.display = 'block';
                    modal.classList.add('active');
                }
            }

            function deleteProductDirectly(productId) {
                if (confirm('Biztosan törölni szeretné ezt a terméket?')) {
                    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
                    const updatedProducts = storedProducts.filter(p => p.id !== productId);
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    loadProducts();
                }
            }

            loadProducts();
        });