import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/db";
import "./cardcontainer.css";
import {
  favUpdate,
  not_favUpdate,
  deleteCard,
  updateCard,
} from "../../api/CardApi";

const CardContainer = ({
  cat,
  onCat,
  onSubmit,
  link,
  onLink,
  description,
  onDes,
  id,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [cards, setCards] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [favoriteMap, setFavoriteMap] = useState({});
  const [editCard, setEditCard] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const favHandler = async (cardId) => {
    await favUpdate(cardId);
    setFavoriteMap((prev) => ({ ...prev, [cardId]: true }));
  };

  const notFavHandler = async (cardId) => {
    await not_favUpdate(cardId);
    setFavoriteMap((prev) => ({ ...prev, [cardId]: false }));
  };

  const handleDelete = async (cardId) => {
    await deleteCard(cardId);
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const handleEdit = (card) => {
    setEditCard(card);
    setEditTitle(card.title);
    setEditLink(card.link);
    setEditDesc(card.description);
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateCard(editCard.id, {
      title: editTitle,
      link: editLink,
      description: editDesc,
    });

    setCards(
      cards.map((c) =>
        c.id === editCard.id
          ? { ...c, title: editTitle, link: editLink, description: editDesc }
          : c
      )
    );

    setEditModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: cardData, error: cardError } = await supabase
        .from("cards")
        .select("id, title, link, description, is_favorite")
        .eq("category_id", id);

      if (cardError) console.error("Card fetch error:", cardError);
      setCards(cardData || []);

      const favMap = {};
      (cardData || []).forEach((card) => {
        favMap[card.id] = card.is_favorite;
      });
      setFavoriteMap(favMap);

      const { data: categoryData, error: catError } = await supabase
        .from("categories")
        .select("name")
        .eq("id", id)
        .single();

      if (catError) console.error("Category fetch error:", catError);
      setCategoryName(categoryData?.name || "Untitled Category");
    };

    fetchData();
  }, [id]);

  return (
    <div className="container">
      <header className="header">
        <div className="logo">Links Page</div>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          + Create
        </button>
      </header>

      <h2 className="category-title">{categoryName}</h2>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <form onSubmit={onSubmit} className="modal-form">
              <input
                type="text"
                value={cat}
                onChange={onCat}
                placeholder="Card Title"
                required
                className="input"
              />
              <input
                type="url"
                value={link}
                onChange={onLink}
                placeholder="Source Link"
                className="input"
              />
              <textarea
                value={description}
                onChange={onDes}
                placeholder="Description"
                rows={4}
                className="textarea"
              />
              <button type="submit" className="submit-btn">
                Add Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditModal(false)}>
              ✖
            </button>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit Title"
                required
                className="input"
              />
              <input
                type="url"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="Edit Link"
                className="input"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Edit Description"
                rows={4}
                className="textarea"
              />
              <button type="submit" className="submit-btn">
                Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Card List */}
      <main className="card-grid">
        {cards.map((item) => (
          <div key={item.id} className="card">
            <h3 className="card-title">{item.title}</h3>
            <p className="card-desc">{item.description}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
            >
              Visit Link ↗
            </a>
            <br />
            <br />
            <div className="fav">
              {favoriteMap[item.id] ? (
                <button onClick={() => notFavHandler(item.id)} className="fav">
                  ★ Favorited
                </button>
              ) : (
                <button onClick={() => favHandler(item.id)} className="fav">
                  ☆ Mark Fav
                </button>
              )}
              <div className="action">
                {" "}
                <button onClick={() => handleEdit(item)} className="edit">
                  ✎{" "}edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete"
                >
                  🗑{" "}delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default CardContainer;
