"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const cards = [];
    const colors = ["Hearts", "Diamonds", "Clubs", "Spades"];

    for (let deck = 0; deck < 2; deck++) {
      // Añadir jokers
      for (let j = 0; j < 2; j++) {
        cards.push({
          number: null,
          color: "Joker",
          joker: true,
          image: "https://media.istockphoto.com/id/458641467/photo/playing-card-joker-xxxxl.jpg?s=1024x1024&w=is&k=20&c=zRXuh5aVnXtyo9UxhWvEcb-couzAXReN0VP0jksEL94=",
        });
      }

      // Añadir cartas normales
      for (let color of colors) {
        for (let number = 1; number <= 13; number++) {
          cards.push({
            number: number,
            color: color,
            joker: false,
            image: getImageUrl(color, number),
          });
        }
      }
    }

    await queryInterface.bulkInsert("NormalCards", cards, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("NormalCards", null, {});
  }
};

function getImageUrl(color, number) {
  const diccionario = {
    "hearts_1" : "https://media.istockphoto.com/id/166089289/photo/ace-of-hearts-playing-card-on-white-background.jpg?s=612x612&w=0&k=20&c=Fvia6ygl7KqyzjE3zNrmuzc0xJLQVRy8NmV9SijWtdU=",
    "hearts_2" : "https://media.istockphoto.com/id/166089272/photo/playing-card-two-of-hearts.jpg?s=612x612&w=0&k=20&c=KwmZcopk_tmMEc6vKM7mbmhSs5w5oHxGiTl6k4cnpuA=",
    "hearts_3" : "https://media.istockphoto.com/id/166089246/zh/%E7%85%A7%E7%89%87/playing-card-three-of-hearts.jpg?s=612x612&w=0&k=20&c=hZCApPil0E5v02rEmEY_Sego89BdUjj6YaQMb64rgr0=",
    "hearts_4" : "https://media.istockphoto.com/id/166089271/photo/playing-card-four-of-hearts.jpg?s=612x612&w=0&k=20&c=kg_c_q6wrYmZsF5zghwqtvWMZRYVP1IPKoMPI0c9vgs=",
    "hearts_5" : "https://media.istockphoto.com/id/644201256/photo/five-of-hearts-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=l37gsUPEWGopbXFhh0jKVoUFvii37uNZQRARNEks6Qs=",
    "hearts_6" : "https://media.istockphoto.com/id/166163018/photo/playing-card-six-of-hearts.jpg?s=612x612&w=0&k=20&c=HZmP85LZ0P4UGiLn-Hz-cTwPvo6EskEIXPyZw1C9sVg=",
    "hearts_7" : "https://media.istockphoto.com/id/166089254/photo/playing-card-seven-of-hearts.jpg?s=612x612&w=0&k=20&c=-cbW4jEYxM6xR68VQfUDrxEP4JLBEcFssujI9qtO9lA=",
    "hearts_8" : "https://media.istockphoto.com/id/166087009/photo/playing-card-eight-of-hearts.jpg?s=612x612&w=0&k=20&c=kcBT1sJhAsIP9y315PyicU5oicDcDnDj0THaeHg7KYY=",
    "hearts_9" : "https://media.istockphoto.com/id/166087097/photo/playing-card-nine-of-hearts.jpg?s=612x612&w=0&k=20&c=g6PwXu025i7ONMGUFWL_FbDtxoTxs1jAW62-xtZ8ltc=",
    "hearts_10" : "https://media.istockphoto.com/id/166087315/photo/playing-card-ten-of-hearts.jpg?s=612x612&w=0&k=20&c=RPl-1Uc3kJ0X3Dpp3E8Yh_Q44cyusrIdQ4_yfuF_5HY=",
    "hearts_11" : "https://media.istockphoto.com/id/1300991986/photo/jack-of-hearts-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=XdnjzldfmWWPhJ74-reNDXeqW6fHao3NkB8wqoBDUbY=",
    "hearts_12" : "https://media.istockphoto.com/id/166089285/photo/playing-card-queen-of-hearts.jpg?s=612x612&w=0&k=20&c=8cOqfbnagVY_uhVZ1KVpL7yYe-6-bTNxQdOQwdHIe9A=",
    "hearts_13" : "https://media.istockphoto.com/id/166089307/photo/playing-card-king-of-hearts.jpg?s=612x612&w=0&k=20&c=ZF2PoDa-jLyWGYMl1-AK4B6E2DBAmuDS6MM_1gFV9zY=",
    "spades_1" : "https://media.istockphoto.com/id/176127753/photo/ace-of-spades-isolated.jpg?s=612x612&w=0&k=20&c=QnaeExTiZfvCX2TqJR-QPp0_QPJRMaU5RsqiNl8uAtA=",
    "spades_2" : "https://media.istockphoto.com/id/1300818174/photo/two-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=VV8GuscMLTsRk7_raaR64abjJKlc6dNdERYevSwTF0c=",
    "spades_3" : "https://media.istockphoto.com/id/1300813565/photo/three-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=2EkbjgvPeCMQzpRi9gGufdiSLghiZBm-Qxl3lDchv_Q=",
    "spades_4" : "https://media.istockphoto.com/id/1300813566/photo/four-of-spades-playing-card-isolated.jpg?s=1024x1024&w=is&k=20&c=k1pwKI_5pcrPxa7O2yRM06qlPckrs4J3FzjmJdrEjoc=",
    "spades_5" : "https://media.istockphoto.com/id/183383412/photo/five-of-spades.jpg?s=612x612&w=0&k=20&c=XJuEE8b_3pB9ykP_rH0CzWCF-Bso_414V3ja26cvRj0=",
    "spades_6" : "https://media.istockphoto.com/id/1300798501/photo/six-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=OWIa5Mo_jFtAJuOKX0KE1t5WY1kfEDEJdyLzVrhMk9Y=",
    "spades_7" : "https://media.istockphoto.com/id/158580454/photo/playing-card-seven-of-spades.jpg?s=612x612&w=0&k=20&c=KklelLumbAjDY-H5XsbVD-mt5eWJcF4BzvvYQApT_Ig=",
    "spades_8" : "https://media.istockphoto.com/id/158580462/photo/playing-card-eight-of-spades.jpg?s=1024x1024&w=is&k=20&c=uxQGimS4LSmNvblZeEIhze5qy1DxfnfFDw4TxPs97HQ=",
    "spades_9" : "https://media.istockphoto.com/id/158811055/es/foto/carta-de-nueve-de-picas.jpg?s=612x612&w=0&k=20&c=X5ql8C1idU4FZbFJ7N0eE6k5FqbiSlr0OQE8LONQgFU=",
    "spades_10" : "https://media.istockphoto.com/id/644204736/photo/ten-of-spades-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=rJhTyT3mbyeMxdr1ylse7Gp8BAkt8Xd6rZQkDgYl6Yw=",
    "spades_11" : "https://media.istockphoto.com/id/458107633/photo/playing-card-jack-of-spades.jpg?s=612x612&w=0&k=20&c=a-mINTa2c8v8NozjPESAvrc8hc7Fac5rpuwJwJ20ZmQ=",
    "spades_12" : "https://media.istockphoto.com/id/644208246/photo/queen-of-spades-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=EhzQRGrFgO6pOLRNERbCND9wKiYsw-JCj87_m9H4LSw=",
    "spades_13" : "https://media.istockphoto.com/id/1342630399/photo/king-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=ZpjHyRgvperujg98Uggbu22Ix5UTo4U9ir753mTrfZM=",
    "clubs_1" : "https://media.istockphoto.com/id/644209722/photo/ace-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=SRsOQeGosipboNF38FPx13Y1qgT4-v9BqoXBQ7WN9H0=",
    "clubs_2" : "https://media.istockphoto.com/id/1301268414/photo/two-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=F2GUCXP55AYuYbvs5tpFZ1nGt57dhaPw9qf8UXdXEfY=",
    "clubs_3" : "https://media.istockphoto.com/id/1301277070/photo/three-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=jA5-kaNwW-VmEKIWbnhj3eswi9tQJmdIOghqykxYvmg=",
    "clubs_4" : "https://media.istockphoto.com/id/1301277071/photo/four-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=q83LQiI8GtCQgocZskm-Sev4w_UUgpTe82sDJVj5c08=",
    "clubs_5" : "https://media.istockphoto.com/id/1301269271/photo/five-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=73gfKHgiyq6ThXSd-U2jocj0Xdqv5BlA_CJczJBjcgc=",
    "clubs_6" : "https://media.istockphoto.com/id/644201754/photo/six-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=m9zu0RgIwt49d3fl0A8Q-jxFPmQIO1BzdOxwKn16wok=",
    "clubs_7" : "https://media.istockphoto.com/id/155652059/photo/playing-card-seven-of-clubs.jpg?s=612x612&w=0&k=20&c=dOYF6sn19rb8EPoL7QjCGvJph47odZEmKGaBcbJ8O0c=",
    "clubs_8" : "https://media.istockphoto.com/id/1301268451/photo/eight-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=9zyT0yCyVpF4LwHsOeB8nG8S8uvYcpUMMvcbR83dxv8=",
    "clubs_9" : "https://media.istockphoto.com/id/166087479/photo/playing-card-nine-of-clubs.jpg?s=612x612&w=0&k=20&c=0K1Zwp_Z1Dr7CVfznxbc3suqhzqpR9DJ9j5pClAo1dc=",
    "clubs_10" : "https://media.istockphoto.com/id/166087462/photo/playing-card-ten-of-clubs.jpg?s=1024x1024&w=is&k=20&c=O9u7sDkL3ZFfvYphr8KXg6gg-gzEerDZe4x4EGoPSDs=",
    "clubs_11" : "https://media.istockphoto.com/id/644205972/photo/jack-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=Qzaj5Hj7SRQ8wUinE4NJgmgjCOjGpDp1G0Lq_NfJh-s=",
    "clubs_12" : "https://media.istockphoto.com/id/644208582/photo/queen-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=rJe0qNjRIfRhgElwLG6ao0kHZ8ih8tAhdnzYS81urL8=",
    "clubs_13" : "https://media.istockphoto.com/id/149127808/photo/playing-card-king-of-clubs.jpg?s=612x612&w=0&k=20&c=p2yYP9K-V_wWnLBipMbltAEzCwDn372lQqySbmnegmU=",
    "diamonds_1" : "https://media.istockphoto.com/id/644209802/photo/ace-of-diamonds-playing-card-isolated-on-black-background.jpg?s=170667a&w=0&k=20&c=pwVrUEP3_Pqx84PDlm-3QtUjAiwZTCZQo08PSTMKb-o=",
    "diamonds_2" : "https://media.istockphoto.com/id/644197830/photo/two-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=bTEKso3C6BikTRi-motEMt-RuV44uqQkhnIWzz4lm3s=",
    "diamonds_3" : "https://media.istockphoto.com/id/162283938/photo/playing-card-three-of-diamonds.jpg?s=612x612&w=0&k=20&c=_mGulpvDDA-_exBKLpoxid9SSAfrqguxZ6sKFPS2NV4=",
    "diamonds_4" : "https://media.istockphoto.com/id/644199122/photo/four-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=WGFgAhh0_zD1DcnlOabSWL3r4xmIt2ptL1lEjgTaZ-Y=",
    "diamonds_5" : "https://media.istockphoto.com/id/644201562/photo/five-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=8q6jXI8b04N-XZSU369fLCgifZJnZqev5kCkYnofpm0=",
    "diamonds_6" : "https://media.istockphoto.com/id/644201812/photo/six-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=Qi_V6zPiJ4fE3MBxczChA-0FSJdmYoDiESdCacERXh0=",
    "diamonds_7" : "https://media.istockphoto.com/id/149137021/photo/playing-card-seven-of-diamonds.jpg?s=612x612&w=0&k=20&c=Ex5Uc6DXYqZE3GRyGpR_Xkx-7nft1zg9zlEGxiayVCw=",
    "diamonds_8" : "https://media.istockphoto.com/id/644202386/photo/eight-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=ruCIu0EAU2pzvWj3WFpWvL9Ixyb4g7n9HLGGYlzdaos=",
    "diamonds_9" : "https://media.istockphoto.com/id/644202620/photo/nine-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=lBBJVGe8aAeMclkWfnfT4cLLrBX96qJ1_b_MoOVUKbQ=",
    "diamonds_10" : "https://media.istockphoto.com/id/644205206/photo/ten-of-diamonds-playing-card-isolated-on-black-background.jpg?s=1024x1024&w=is&k=20&c=LGl3hASmjyPoIn-8o5ignSSpgDf-zxtXfT3Fq1FViS0=",
    "diamonds_11" : "https://media.istockphoto.com/id/163052036/photo/playing-card-jack-of-diamonds.jpg?s=612x612&w=0&k=20&c=XcIRFqEjTM558ng6-gIfnnhZS24RlT5x_2RyXVLRbCU=",
    "diamonds_12" : "https://media.istockphoto.com/id/149137023/photo/playing-card-queen-of-diamonds.jpg?s=612x612&w=0&k=20&c=8aF1MjYd4DXdhcNSkWMwtAxclw7z7bTFhjfEYtrjtWM=",
    "diamonds_13" : "https://media.istockphoto.com/id/149126841/photo/playing-card-king-of-diamonds.jpg?s=612x612&w=0&k=20&c=657XCgwe9QEeOtgSVvG3Vk4WVTVUXwuNgt47oGa3nls="
  };

  return diccionario[`${color.toLowerCase()}_${number}`];
}
/*
url/corazon/A : https://media.istockphoto.com/id/166089289/photo/ace-of-hearts-playing-card-on-white-background.jpg?s=612x612&w=0&k=20&c=Fvia6ygl7KqyzjE3zNrmuzc0xJLQVRy8NmV9SijWtdU=
url/corazon/2 : https://media.istockphoto.com/id/166089272/photo/playing-card-two-of-hearts.jpg?s=612x612&w=0&k=20&c=KwmZcopk_tmMEc6vKM7mbmhSs5w5oHxGiTl6k4cnpuA=
url/corazon/3 : https://media.istockphoto.com/id/166089246/zh/%E7%85%A7%E7%89%87/playing-card-three-of-hearts.jpg?s=612x612&w=0&k=20&c=hZCApPil0E5v02rEmEY_Sego89BdUjj6YaQMb64rgr0=
url/corazon/4 : https://media.istockphoto.com/id/166089271/photo/playing-card-four-of-hearts.jpg?s=612x612&w=0&k=20&c=kg_c_q6wrYmZsF5zghwqtvWMZRYVP1IPKoMPI0c9vgs=
url/corazon/5 : https://media.istockphoto.com/id/644201256/photo/five-of-hearts-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=l37gsUPEWGopbXFhh0jKVoUFvii37uNZQRARNEks6Qs=
url/corazon/6 : https://media.istockphoto.com/id/166163018/photo/playing-card-six-of-hearts.jpg?s=612x612&w=0&k=20&c=HZmP85LZ0P4UGiLn-Hz-cTwPvo6EskEIXPyZw1C9sVg=
url/corazon/7 : https://media.istockphoto.com/id/166089254/photo/playing-card-seven-of-hearts.jpg?s=612x612&w=0&k=20&c=-cbW4jEYxM6xR68VQfUDrxEP4JLBEcFssujI9qtO9lA=
url/corazon/8 : https://media.istockphoto.com/id/166087009/photo/playing-card-eight-of-hearts.jpg?s=612x612&w=0&k=20&c=kcBT1sJhAsIP9y315PyicU5oicDcDnDj0THaeHg7KYY=
url/corazon/9 : https://media.istockphoto.com/id/166087097/photo/playing-card-nine-of-hearts.jpg?s=612x612&w=0&k=20&c=g6PwXu025i7ONMGUFWL_FbDtxoTxs1jAW62-xtZ8ltc=
url/corazon/10 : https://media.istockphoto.com/id/166087315/photo/playing-card-ten-of-hearts.jpg?s=612x612&w=0&k=20&c=RPl-1Uc3kJ0X3Dpp3E8Yh_Q44cyusrIdQ4_yfuF_5HY=
url/corazon/J : https://media.istockphoto.com/id/1300991986/photo/jack-of-hearts-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=XdnjzldfmWWPhJ74-reNDXeqW6fHao3NkB8wqoBDUbY=
url/corazon/Q : https://media.istockphoto.com/id/166089285/photo/playing-card-queen-of-hearts.jpg?s=612x612&w=0&k=20&c=8cOqfbnagVY_uhVZ1KVpL7yYe-6-bTNxQdOQwdHIe9A=
url/corazon/K : https://media.istockphoto.com/id/166089307/photo/playing-card-king-of-hearts.jpg?s=612x612&w=0&k=20&c=ZF2PoDa-jLyWGYMl1-AK4B6E2DBAmuDS6MM_1gFV9zY=
url/pica/A : https://media.istockphoto.com/id/176127753/photo/ace-of-spades-isolated.jpg?s=612x612&w=0&k=20&c=QnaeExTiZfvCX2TqJR-QPp0_QPJRMaU5RsqiNl8uAtA=
url/pica/2 : https://media.istockphoto.com/id/1300818174/photo/two-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=VV8GuscMLTsRk7_raaR64abjJKlc6dNdERYevSwTF0c=
url/pica/3 : https://media.istockphoto.com/id/1300813565/photo/three-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=2EkbjgvPeCMQzpRi9gGufdiSLghiZBm-Qxl3lDchv_Q=
url/pica/4 : https://media.istockphoto.com/id/1300813566/photo/four-of-spades-playing-card-isolated.jpg?s=1024x1024&w=is&k=20&c=k1pwKI_5pcrPxa7O2yRM06qlPckrs4J3FzjmJdrEjoc=
url/pica/5 : https://media.istockphoto.com/id/183383412/photo/five-of-spades.jpg?s=612x612&w=0&k=20&c=XJuEE8b_3pB9ykP_rH0CzWCF-Bso_414V3ja26cvRj0=
url/pica/6 : https://media.istockphoto.com/id/1300798501/photo/six-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=OWIa5Mo_jFtAJuOKX0KE1t5WY1kfEDEJdyLzVrhMk9Y=
url/pica/7 : https://media.istockphoto.com/id/158580454/photo/playing-card-seven-of-spades.jpg?s=612x612&w=0&k=20&c=KklelLumbAjDY-H5XsbVD-mt5eWJcF4BzvvYQApT_Ig=
url/pica/8 : https://media.istockphoto.com/id/158580462/photo/playing-card-eight-of-spades.jpg?s=1024x1024&w=is&k=20&c=uxQGimS4LSmNvblZeEIhze5qy1DxfnfFDw4TxPs97HQ=
url/pica/9 : https://media.istockphoto.com/id/158811055/es/foto/carta-de-nueve-de-picas.jpg?s=612x612&w=0&k=20&c=X5ql8C1idU4FZbFJ7N0eE6k5FqbiSlr0OQE8LONQgFU=
url/pica/10 : https://media.istockphoto.com/id/644204736/photo/ten-of-spades-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=rJhTyT3mbyeMxdr1ylse7Gp8BAkt8Xd6rZQkDgYl6Yw=
url/pica/J : https://media.istockphoto.com/id/458107633/photo/playing-card-jack-of-spades.jpg?s=612x612&w=0&k=20&c=a-mINTa2c8v8NozjPESAvrc8hc7Fac5rpuwJwJ20ZmQ=
url/pica/Q : https://media.istockphoto.com/id/644208246/photo/queen-of-spades-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=EhzQRGrFgO6pOLRNERbCND9wKiYsw-JCj87_m9H4LSw=
url/pica/K : https://media.istockphoto.com/id/1342630399/photo/king-of-spades-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=ZpjHyRgvperujg98Uggbu22Ix5UTo4U9ir753mTrfZM=
url/trebol/A : https://media.istockphoto.com/id/644209722/photo/ace-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=SRsOQeGosipboNF38FPx13Y1qgT4-v9BqoXBQ7WN9H0=
url/trebol/2 : https://media.istockphoto.com/id/1301268414/photo/two-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=F2GUCXP55AYuYbvs5tpFZ1nGt57dhaPw9qf8UXdXEfY=
url/trebol/3 : https://media.istockphoto.com/id/1301277070/photo/three-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=jA5-kaNwW-VmEKIWbnhj3eswi9tQJmdIOghqykxYvmg=
url/trebol/4 : https://media.istockphoto.com/id/1301277071/photo/four-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=q83LQiI8GtCQgocZskm-Sev4w_UUgpTe82sDJVj5c08=
url/trebol/5 : https://media.istockphoto.com/id/1301269271/photo/five-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=73gfKHgiyq6ThXSd-U2jocj0Xdqv5BlA_CJczJBjcgc=
url/trebol/6 : https://media.istockphoto.com/id/644201754/photo/six-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=m9zu0RgIwt49d3fl0A8Q-jxFPmQIO1BzdOxwKn16wok=
url/trebol/7 : https://media.istockphoto.com/id/155652059/photo/playing-card-seven-of-clubs.jpg?s=612x612&w=0&k=20&c=dOYF6sn19rb8EPoL7QjCGvJph47odZEmKGaBcbJ8O0c=
url/trebol/8 : https://media.istockphoto.com/id/1301268451/photo/eight-of-clubs-playing-card-isolated.jpg?s=612x612&w=0&k=20&c=9zyT0yCyVpF4LwHsOeB8nG8S8uvYcpUMMvcbR83dxv8=
url/trebol/9 : https://media.istockphoto.com/id/166087479/photo/playing-card-nine-of-clubs.jpg?s=612x612&w=0&k=20&c=0K1Zwp_Z1Dr7CVfznxbc3suqhzqpR9DJ9j5pClAo1dc=
url/trebol/10 : https://media.istockphoto.com/id/166087462/photo/playing-card-ten-of-clubs.jpg?s=1024x1024&w=is&k=20&c=O9u7sDkL3ZFfvYphr8KXg6gg-gzEerDZe4x4EGoPSDs=
url/trebol/J : https://media.istockphoto.com/id/644205972/photo/jack-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=Qzaj5Hj7SRQ8wUinE4NJgmgjCOjGpDp1G0Lq_NfJh-s=
url/trebol/Q : https://media.istockphoto.com/id/644208582/photo/queen-of-clubs-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=rJe0qNjRIfRhgElwLG6ao0kHZ8ih8tAhdnzYS81urL8=
url/trebol/K : https://media.istockphoto.com/id/149127808/photo/playing-card-king-of-clubs.jpg?s=612x612&w=0&k=20&c=p2yYP9K-V_wWnLBipMbltAEzCwDn372lQqySbmnegmU=
url/diamante/A : https://media.istockphoto.com/id/644209802/photo/ace-of-diamonds-playing-card-isolated-on-black-background.jpg?s=170667a&w=0&k=20&c=pwVrUEP3_Pqx84PDlm-3QtUjAiwZTCZQo08PSTMKb-o=
url/diamante/2 : https://media.istockphoto.com/id/644197830/photo/two-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=bTEKso3C6BikTRi-motEMt-RuV44uqQkhnIWzz4lm3s=
url/diamante/3 : https://media.istockphoto.com/id/162283938/photo/playing-card-three-of-diamonds.jpg?s=612x612&w=0&k=20&c=_mGulpvDDA-_exBKLpoxid9SSAfrqguxZ6sKFPS2NV4=
url/diamante/4 : https://media.istockphoto.com/id/644199122/photo/four-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=WGFgAhh0_zD1DcnlOabSWL3r4xmIt2ptL1lEjgTaZ-Y=
url/diamante/5 : https://media.istockphoto.com/id/644201562/photo/five-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=8q6jXI8b04N-XZSU369fLCgifZJnZqev5kCkYnofpm0=
url/diamante/6 : https://media.istockphoto.com/id/644201812/photo/six-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=Qi_V6zPiJ4fE3MBxczChA-0FSJdmYoDiESdCacERXh0=
url/diamante/7 : https://media.istockphoto.com/id/149137021/photo/playing-card-seven-of-diamonds.jpg?s=612x612&w=0&k=20&c=Ex5Uc6DXYqZE3GRyGpR_Xkx-7nft1zg9zlEGxiayVCw=
url/diamante/8 : https://media.istockphoto.com/id/644202386/photo/eight-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=ruCIu0EAU2pzvWj3WFpWvL9Ixyb4g7n9HLGGYlzdaos=
url/diamante/9 : https://media.istockphoto.com/id/644202620/photo/nine-of-diamonds-playing-card-isolated-on-black-background.jpg?s=612x612&w=0&k=20&c=lBBJVGe8aAeMclkWfnfT4cLLrBX96qJ1_b_MoOVUKbQ=
url/diamante/10 : https://media.istockphoto.com/id/644205206/photo/ten-of-diamonds-playing-card-isolated-on-black-background.jpg?s=1024x1024&w=is&k=20&c=LGl3hASmjyPoIn-8o5ignSSpgDf-zxtXfT3Fq1FViS0=
url/diamante/J : https://media.istockphoto.com/id/163052036/photo/playing-card-jack-of-diamonds.jpg?s=612x612&w=0&k=20&c=XcIRFqEjTM558ng6-gIfnnhZS24RlT5x_2RyXVLRbCU=
url/diamante/Q : https://media.istockphoto.com/id/149137023/photo/playing-card-queen-of-diamonds.jpg?s=612x612&w=0&k=20&c=8aF1MjYd4DXdhcNSkWMwtAxclw7z7bTFhjfEYtrjtWM=
url/diamante/K : https://media.istockphoto.com/id/149126841/photo/playing-card-king-of-diamonds.jpg?s=612x612&w=0&k=20&c=657XCgwe9QEeOtgSVvG3Vk4WVTVUXwuNgt47oGa3nls=
*/