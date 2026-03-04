import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

const SearchBar = ({ mode = "light", onSearch, placeholder = "Search", width = "200px" }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="search-bar-container">
      <InputGroup 
        className={`rounded-pill overflow-hidden border border-dark search-input-group ${isFocused ? 'focused' : ''} ${mode}`}
        style={{ width: width }}  
      >
        <Form.Control
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`border-0 shadow-none search-input ${mode}`}
          style={{ 
            backgroundColor: 'transparent',
            outline: 'none', 
            boxShadow: 'none',
            borderRight: 'none',
            color: mode === "dark" ? "#ffffff" : "#000000"
          }}
        />
        
        <Button
          type="submit"
          variant="light"
          className="border-0 bg-transparent px-3 search-button"
          style={{ 
            outline: 'none', 
            boxShadow: 'none',
            borderLeft: 'none',
          }}
        >
          <i 
            className="bi bi-search"
            style={{
              color: mode === "dark" ? "#ffffff" : "#000000"
            }}
          ></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;