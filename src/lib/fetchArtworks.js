export async function fetchArtworks(search = '', category = '', minPrice = '', maxPrice = '') {
    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category && category !== 'All Categories') queryParams.append('category', category);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        const res = await fetch(`http://localhost:5000/api/artworks?${queryParams.toString()}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) {
            console.error("Failed to fetch artworks:", res.statusText);
            return [];
        }
        
        return res.json();
    } catch (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }
}
