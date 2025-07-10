        let audioContext = null;
        let navigationActive = false;
        let speedInterval;
        let directionInterval;

        function initAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio not supported');
            }
        }

        function playClickSound(frequency = 800, duration = 200) {
            if (!audioContext) return;
        
            try {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + duration / 1000);
            } catch (e) {
                console.log('Audio playback failed');
            }
        }

        function showBinInfo() {
            playClickSound(900, 150);
            // Hide waste popup first
            document.getElementById('wastePopup').classList.remove('show');
            // Show bin popup
            document.getElementById('binPopup').classList.add('show');
            // Don't auto-hide, let user interact
        }

        function showWasteInfo() {
            playClickSound(900, 150);
            // Hide bin popup first
            document.getElementById('binPopup').classList.remove('show');
            // Show waste popup
            document.getElementById('wastePopup').classList.add('show');
            // Don't auto-hide, let user interact
        }

        function startNavigation(type) {
            playClickSound(1000, 400);
            navigationActive = true;
            
            // Hide all popups first
            document.getElementById('binPopup').classList.remove('show');
            document.getElementById('wastePopup').classList.remove('show');
            
            // Transition to navigation view
            setTimeout(() => {
                document.getElementById('mapView').classList.add('inactive');
                document.getElementById('navigationView').classList.add('active');

                updateNavigation()
            }, 200);
            
            // Start speed simulation
            setTimeout(() => {
                startSpeedSimulation();
            }, 500);
            
            // Play navigation sound
            /*if (audioEnabled =) {
                setTimeout(() => {
                    speakDirection("Navigation started. Turn left in 20 meters");
                }, 1500);
            }
        }*/
    }
        function goBackToMap() {
            playClickSound();
            navigationActive = false;
            
            document.getElementById('navigationView').classList.remove('active');
            document.getElementById('mapView').classList.remove('inactive');
            
            // Stop speed simulation
            if (speedInterval) {
                clearInterval(speedInterval);
            }
        }

        function goBack() {
            playClickSound();
            // Simulate going back to previous screen
        }

        function toggleSearch() {
            playClickSound();
            const overlay = document.getElementById('searchOverlay');
            const input = document.getElementById('searchInput');
            
            if (overlay.classList.contains('active')) {
                closeSearch();
            } else {
                overlay.classList.add('active');
                setTimeout(() => {
                    input.focus();
                }, 300);
            }
        }

        function closeSearch() {
            playClickSound();
            const overlay = document.getElementById('searchOverlay');
            const input = document.getElementById('searchInput');
            
            overlay.classList.remove('active');
            input.value = '';
            document.getElementById('searchClear').style.display = 'none';
            showDefaultResults();
        }

        function handleSearch() {
            const input = document.getElementById('searchInput');
            const clearBtn = document.getElementById('searchClear');
            const loading = document.getElementById('searchLoading');
            const suggestions = document.getElementById('searchSuggestions');
            const noResults = document.getElementById('noResults');
            const recentSearches = document.getElementById('recentSearches');
            
            // Show/hide clear button
            clearBtn.style.display = input.value ? 'flex' : 'none';
            
            if (input.value.trim() === '') {
                showDefaultResults();
                return;
            }
            
            // Hide all sections
            suggestions.style.display = 'none';
            noResults.classList.remove('active');
            recentSearches.style.display = 'none';
            
            // Show loading
            loading.classList.add('active');
            
            // Simulate search delay
            setTimeout(() => {
                loading.classList.remove('active');
                
                const searchTerm = input.value.toLowerCase();
                const filteredItems = filterSearchResults(searchTerm);
                
                if (filteredItems.length > 0) {
                    displaySearchResults(filteredItems);
                } else {
                    noResults.classList.add('active');
                }
            }, 800);
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        }

        function clearSearch() {
            playClickSound();
            const input = document.getElementById('searchInput');
            input.value = '';
            document.getElementById('searchClear').style.display = 'none';
            showDefaultResults();
            input.focus();
        }

        function searchFor(term) {
            playClickSound();
            const input = document.getElementById('searchInput');
            input.value = term;
            handleSearch();
        }

        function selectSearchItem(type, name) {
            playClickSound();
            
            // Add to recent searches
            addToRecentSearches(name);
            
            // Close search overlay
            closeSearch();
            
            // Show appropriate info based on type
            if (type === 'bin' && name === 'Bin #16') {
                showBinInfo();
            } else if (type === 'waste') {
                showWasteInfo();
            } else {
                // For other items, show a generic popup
                showGenericInfo(type, name);
            }
            
        }

        function showDefaultResults() {
            document.getElementById('searchSuggestions').style.display = 'block';
            document.getElementById('noResults').classList.remove('active');
            document.getElementById('searchLoading').classList.remove('active');
            document.getElementById('recentSearches').style.display = 'flex';
        }

        function filterSearchResults(searchTerm) {
            const allItems = [
                { type: 'bin', name: 'Bin #16', location: 'Main Street, Block A', distance: '0.2 km', status: '60%' },
                { type: 'waste', name: 'Waste Collection Point', location: 'Central Plaza', distance: '0.5 km', status: 'Waiting' },
                { type: 'bin', name: 'Bin #23', location: 'Park Avenue', distance: '0.8 km', status: '15%' },
            
            ];
            
            return allItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm) ||
                item.type.toLowerCase().includes(searchTerm)
            );
        }

        function displaySearchResults(items) {
            const suggestions = document.getElementById('searchSuggestions');
            suggestions.innerHTML = '';
            
            const wasteItems = items.filter(item => item.type === 'bin' || item.type === 'waste');
            const otherItems = items.filter(item => item.type !== 'bin' && item.type !== 'waste');
            
            if (wasteItems.length > 0) {
                suggestions.innerHTML += '<div class="search-category">WASTE MANAGEMENT</div>';
                wasteItems.forEach(item => {
                    suggestions.innerHTML += createSearchItemHTML(item);
                });
            }
            
            if (otherItems.length > 0) {
                suggestions.innerHTML += '<div class="search-category">NEARBY PLACES</div>';
                otherItems.forEach(item => {
                    suggestions.innerHTML += createSearchItemHTML(item);
                });
            }
            
            suggestions.style.display = 'block';
            
            // Re-attach click events
            suggestions.querySelectorAll('.search-item').forEach(item => {
                item.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    const name = this.getAttribute('data-name');
                    selectSearchItem(type, name);
                });
            });
        }

        function createSearchItemHTML(item) {
            const icons = {
                bin: '🗑️',
                waste: '🚮',
        
            };
            
            const badgeClass = item.status === 'Waiting' ? 'full' : 
                             item.status === '60%' ? 'half' : 
                             item.status === '15%' ? 'empty' : '';
            
            const badgeHTML = item.status ? `<div class="search-badge ${badgeClass}">${item.status}</div>` : '';
            
            return `
                <div class="search-item" data-type="${item.type}" data-name="${item.name}">
                    <div class="search-icon ${item.type}">${icons[item.type]}</div>
                    <div class="search-details">
                        <div class="search-title">${item.name}</div>
                        <div class="search-subtitle">${item.location}</div>
                        <div class="search-distance">${item.distance} away</div>
                    </div>
                    ${badgeHTML}
                </div>
            `;
        }

        function addToRecentSearches(name) {
            // This would normally save to localStorage, but we'll just update the UI
            const recentSearches = document.getElementById('recentSearches');
            const existingItems = recentSearches.querySelectorAll('.recent-item');
            
            // Check if item already exists
            let exists = false;
            existingItems.forEach(item => {
                if (item.textContent === name) {
                    exists = true;
                }
            });
            
            if (!exists && existingItems.length < 5) {
                const newItem = document.createElement('div');
                newItem.className = 'recent-item';
                newItem.textContent = name;
                newItem.onclick = () => searchFor(name);
                recentSearches.appendChild(newItem);
            }
        }

        function showGenericInfo(type, name) {
            // Create a temporary popup for non-waste items
            const popup = document.createElement('div');
            popup.className = 'info-popup show';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.innerHTML = `
                <strong>${name}</strong><br>
                Location found!<br>
                <button class="navigate-btn" onclick="startNavigation('${type}')">Navigate To ></button>
            `;
            
            document.querySelector('.map-container').appendChild(popup);
            
            setTimeout(() => {
                popup.remove();
            }, 3000);
        }


        let isAudioIconOn = true; // purely for icon display

        function toggleAudio() {
            playClickSound(); // Keep this active regardless of icon state

            isAudioIconOn = !isAudioIconOn;
            const btn = document.querySelector('.audio-toggle');
            btn.textContent = isAudioIconOn ? '🔊' : '🔇';
        }
        
        function cancelNavigation() {
            playClickSound();
            goBackToMap();
        }

        function startSpeedSimulation() {
            let speed = 0;
            let direction = 1;
            
            speedInterval = setInterval(() => {
                speed += direction * (Math.random() * 5 + 2);
                
                if (speed >= 45) {
                    direction = -1;
                } else if (speed <= 0) {
                    direction = 1;
                    speed = 0;
                }
                
                document.getElementById('speedValue').textContent = Math.round(speed);
            }, 200);
        }

        /*function speakDirection(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                speechSynthesis.speak(utterance);
            }
        } */

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Add click handlers for navigate buttons
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('navigate-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const popup = e.target.closest('.info-popup');
                    const isBin = popup && popup.classList.contains('bin-popup');
                    startNavigation(isBin ? 'bin' : 'waste');
                }
            });
            
            // Add some interactive elements
            const markers = document.querySelectorAll('.bin-marker, .waste-marker');
            markers.forEach(marker => {
                marker.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.5)';
                });
                
                marker.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });

            document.addEventListener('click', function() {
                if (!audioContext) {
                    initAudio();
                }
            }, { once: true });
            // Add touch support for mobile

            document.addEventListener('touchstart', function(e) {
                if (e.target.classList.contains('bin-marker')) {
                    e.preventDefault();
                    showBinInfo();
                } else if (e.target.classList.contains('waste-marker')) {
                    e.preventDefault();
                    showWasteInfo();
                } else if (!e.target.closest('.info-popup')) {
                    // Hide popups when clicking outside
                    document.getElementById('binPopup').classList.remove('show');
                    document.getElementById('wastePopup').classList.remove('show');
                }
            });
            
            // Add click outside to close popups
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.info-popup') && !e.target.classList.contains('bin-marker') && !e.target.classList.contains('waste-marker')) {
                    document.getElementById('binPopup').classList.remove('show');
                    document.getElementById('wastePopup').classList.remove('show');
                }
            });
        });

        // Add some realistic navigation updates
        function updateNavigation() {
            if (!navigationActive) return;

            const directions = [
                { icon: "↰", text: "Turn Left", distance: "20 m" },
                { icon: "↑", text: "Continue Straight", distance: "150 m" },
                { icon: "↱", text: "Turn Right", distance: "50 m" },
                { icon: "✔", text: "You have arrived", distance: "" }
            ];

            let currentDirection = 0;

            const iconEl = document.querySelector('.direction-icon');
            const textEl = document.querySelector('.direction-text');
            const distanceEl = document.querySelector('.direction-distance');

            // Set initial direction
            iconEl.textContent = directions[0].icon;
            textEl.textContent = directions[0].text;
            distanceEl.textContent = directions[0].distance;

            if (directionInterval) clearInterval(directionInterval);

            directionInterval = setInterval(() => {
                if (!navigationActive || currentDirection >= directions.length - 1) {
                    clearInterval(directionInterval);
                    return;
                }

                currentDirection++;
                const dir = directions[currentDirection];

            textEl.style.opacity = 0;
            distanceEl.style.opacity = 0;

            setTimeout(() => {
                iconEl.textContent = dir.icon;
                distanceEl.textContent = dir.distance;
                textEl.textContent = dir.text;


            textEl.style.opacity = 1
            distanceEl.style.opacity = 1;
            }, 300);

            }, 10000);
        }
                
        // Add realistic map updates
        setInterval(() => {
            if (navigationActive) {
                // Update trip time randomly
                const minutes = Math.max(1, Math.floor(Math.random() * 3) + 1);
                document.querySelector('.trip-time').textContent = minutes + ' min';
                
                // Update distance
                const distance = (Math.random() * 0.5 + 0.5).toFixed(1);
                document.querySelector('.trip-distance').textContent = distance + ' km';
            }
        }, 5000);