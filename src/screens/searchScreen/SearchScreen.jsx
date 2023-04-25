import { useEffect, useState } from 'react';
import './searchScreen.css';

const getHighLightedText = (text, searchText) => {
  console.log({ text }, { searchText });
  const index = text?.toLowerCase()?.indexOf(searchText?.toLowerCase());
  if (index === -1) {
    return <span className='dataText'>{text}</span>;
  }
  const splitText = [
    text.slice(0, index),
    text.slice(index, index + searchText.length),
    text.slice(index + searchText.length),
  ];
  console.log({ splitText });
  return (
    <>
      {splitText.map(
        (item, index) =>
          item && (
            <span className={`dataText ${item.toLowerCase() === searchText.toLowerCase() ? 'highlightedText' : ''}`}>
              {item}
            </span>
          ),
      )}
    </>
  );
};

const SearchScreen = () => {
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const handleSearchTextChange = (e) => {
    const { value } = e?.target;
    if (!value.trim()) {
      return;
    }
    setSearchText(value);
    const filteredData = data.filter((item) => {
      if (
        item?.id?.toLowerCase().includes(value?.toLowerCase()) ||
        item?.name?.toLowerCase().includes(value?.toLowerCase()) ||
        item?.address?.toLowerCase().includes(value?.toLowerCase()) ||
        item?.pincode?.toLowerCase().includes(value?.toLowerCase()) ||
        item?.items?.some((it) => it?.toLowerCase() === value?.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
    console.log({ filteredData });
    setSearchData(filteredData);
  };
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setSearchData([]);
      setSearchText('');
      try {
        const res = await fetch('http://www.mocky.io/v2/5ba8efb23100007200c2750c');
        const resData = await res.json();
        setData(resData);
      } catch (er) {
        console.log(er);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <div>loading..</div>;
  }
  return (
    <div className='searchScreenWrapper'>
      <div className='inputWrapper'>
        <input
          className='inputElement'
          onChange={handleSearchTextChange}
          type='search'
          placeholder='search by userid, name, address'
        />
      </div>
      {searchText && (
        <div className='searchListContainer'>
          <ul className='listWrapper'>
            {searchData?.length ? (
              searchData.map((item) => (
                <li key={item.id} className='searchItemContainer'>
                  <div className='idContainer'>{item.id}</div>
                  <div>{getHighLightedText(item.name, searchText)}</div>
                  <div>{getHighLightedText(item.address, searchText)}</div>
                </li>
              ))
            ) : (
              <li>No data found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
