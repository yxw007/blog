let content = `
https://raw.githubusercontent.com/yxw007/BlogPicBed/master/img/1719379704448.png"
`;

content = content.replace(
	/https:\/\/(raw.githubusercontent.com)\/(.*?)\/(.*?)\/(.*?)(.png|.jpg|jpeg|svg|jif)/gim,
	(match, ...groups) => {
		console.log(groups);
		const [, p2, p3, p4, p5] = groups;
		return `https://cdn.jsdelivr.net/gh/${p2}/${p3}@${p4}${p5}`;
	}
);

console.log(content);
/* 
https://cdn.jsdelivr.net/gh/yxw007/BlogPicBed@master/img/1719379704448.png
https://cdn.jsdelivr.net/gh/yxw007@BlogPicBed/master/img/1719379704448.png

*/
