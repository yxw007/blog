<template>
	<div id="comment-container"></div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useData } from "vitepress";
import md5 from "md5";
import { Message } from "@arco-design/web-vue";
import "@arco-design/web-vue/es/message/style/css.js";
import Gitalk from "gitalk";
import $ from "jquery";
import "../styles/gitalk.css";

const props = defineProps({
	commentConfig: Object,
});
const type = computed(() => props.commentConfig?.type ?? "gitalk");
const { page } = useData();
let gitalk;
if (type.value && type.value == "gitalk") {
	gitalk = new Gitalk({
		clientID: "ace695aecbf2be1dff06",
		clientSecret: "c78b230a5ac0357a2dccb9407158b0b8a6c5800a",
		repo: "BlogGitTalk",
		owner: "aa4790139",
		admin: ["aa4790139"],
		id: md5(page.value.relativePath),
		language: "zh-CN",
		distractionFreeMode: false,
		// 默认: https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token
		// proxy: "https://vercel.charles7c.top/github_access_token",
		proxy: "https://yanxuewen.cn",
	});
}

onMounted(() => {
	if (type.value && type.value == "gitalk") {
		gitalk.render("comment-container");

		// 如果点赞，先判断有没有登录
		let $gc = $("#comment-container");
		$gc.on("click", ".gt-comment-like", function () {
			if (!window.localStorage.getItem("GT_ACCESS_TOKEN")) {
				Message.warning({
					content: "点赞前，请您先进行登录",
					closable: true,
				});

				return false;
			}
			return true;
		});
		// 提交评论后输入框高度没有重置bug
		$gc.on("click", ".gt-header-controls .gt-btn-public", function () {
			let $gt = $(".gt-header-textarea");
			$gt.css("height", "72px");
		});
		// 点击预览时，隐藏评论按钮
		$gc.on("click", ".gt-header-controls .gt-btn-preview", function () {
			let pl = $(".gt-header-controls .gt-btn-public");
			if (pl.hasClass("hide")) {
				pl.removeClass("hide");
			} else {
				// 隐藏
				pl.addClass("hide");
			}
		});
	}
});
</script>

<style scoped></style>
