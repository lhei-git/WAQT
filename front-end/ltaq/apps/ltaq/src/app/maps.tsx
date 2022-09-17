
const Maps = () => (
    <form action="http://www.google.com" method="get">
        <label htmlFor="header-search">
            <span className="visually-hidden">Search</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="Location"
        />
        <button
            type="submit">Submit
        </button>
    </form>
);

export default Maps;