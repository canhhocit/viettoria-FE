import asyncio
import os
import edge_tts

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "audio")

VOICES = {
    "vi": "vi-VN-HoaiMyNeural",
    "en": "en-US-JennyNeural",
    "fr": "fr-FR-DeniseNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
    "ko": "ko-KR-SunHiNeural",
    "ja": "ja-JP-NanamiNeural",
}

SCRIPTS = {
    "chua-mot-cot": {
        "vi": "Mùa đông năm 1049, kinh thành Thăng Long sương sớm bảng lảng. Vua Lý Thái Tông mộng thấy Phật Bà Quan Âm ngự trên tòa sen dắt vua bước lên. Khi tỉnh giấc, triều thần bàn việc lập chùa Diên Hựu giữa lòng hồ Linh Chiểu với trụ đá vươn cao như đóa hoa sen thanh tịnh, cầu chúc cho xã tắc trường thọ thái bình nghìn thu.",
        "en": "In the winter of 1049, morning mist enveloped the capital of Thang Long. King Ly Thai Tong dreamt of Bodhisattva Avalokiteshvara seated on a lotus throne, guiding him upward. Upon awakening, the royal court conceived the founding of Dien Huu Pagoda amidst the Linh Chieu lotus pond, its single stone column soaring like a pristine lotus blossom, blessing the kingdom with peace and millennial longevity.",
        "fr": "À l'hiver 1049, une brume matinale enveloppait la capitale Thang Long. Le roi Ly Thai Tong rêva d'Avalokiteshvara assis sur un lotus, l'invitant à monter. À son réveil, la cour décida d'ériger la pagode Dien Huu au milieu de l'étang Linh Chieu, son unique pilier de pierre s'élevant tel un lotus pur, veillant sur la paix et la prospérité du royaume.",
        "zh": "1049年冬，升龙古城晨雾缭绕。李太宗梦见观世音菩萨坐于莲台引帝登临。醒后朝臣共议，于灵沼池中立石柱建延祐寺，如芙蕖出水，祈国祚延绵、千秋太平。",
        "ko": "1049년 겨울 아침 안개 낀 탕롱 수도에서 리 타이똥 황제는 연화대에 앉은 관세음보살이 손을 이끄는 꿈을 꾸었습니다. 꿈에서 깬 후 린찌에우 연못 중앙에 단 하나의 돌기둥을 세워 연우사를 창건하였습니다.",
        "ja": "1049年の冬、朝霧に包まれた昇龍の都で、李太宗は蓮華座の観音菩薩に手を引かれる夢を見ました。目覚めた帝は臣下と図り、霊沼池に一本の石柱を立てて延祐寺を建立しました。",
    },
    "khue-van-cac": {
        "vi": "Khuê Văn Các soi bóng xuống giếng Thiên Quang phẳng lặng như gương soi lòng kẻ sĩ. Công trình được Tổng trấn Nguyễn Văn Thành cho dựng năm 1805, tượng trưng cho nền học vấn thanh cao và truyền thống tôn sư trọng đạo của dân tộc.",
        "en": "The Khue Van Pavilion reflects upon the tranquil surface of Thien Quang well, mirror of the scholar's soul. Erected in 1805 by Governor-General Nguyen Van Thanh, it stands as an enduring tribute to academic distinction and cultural enlightenment.",
        "fr": "Le pavillon Khue Van se mire dans les eaux calmes du puits Thien Quang, miroir de l'âme des lettrés. Érigé en 1805 par le gouverneur Nguyen Van Thanh, il incarne la noblesse du savoir et le respect des maîtres.",
        "zh": "奎文阁倒映于天光井的静谧水面，如明镜映照文人雅士之心。1805年由总镇阮文诚主持营建，象征着大越崇文重道与尊师重教的优良传统。",
        "ko": "규문각은 선비의 마음을 비추는 거울처럼 고요한 티엔꽝 우물에 모습을 비춥니다. 1805년 총진 응우옌 반 타인이 건립하였으며, 민족의 드높은 학문과 스승을 존경하는 숭고한 전통을 상징합니다.",
        "ja": "奎文閣は、文人の心を映す鏡のように静まり返る天光井の水面にその優美な影を落とします。1805年に総鎮阮文誠により建立され、高潔な学問の精神と尊師重道の伝統を象徴しています。",
    },
    "cot-co-ha-noi": {
        "vi": "Kỳ đài Hà Nội xây dựng năm 1812, là một trong số ít công trình còn nguyên vẹn trong khuôn viên Hoàng thành Thăng Long, ghi dấu thời khắc thiêng liêng ngày giải phóng Thủ đô 10 tháng 10 năm 1954.",
        "en": "Constructed in 1812, the Hanoi Flag Tower is one of the rare monuments that remained intact within the Imperial Citadel, marking the sacred Liberation Day of the capital on October 10, 1954.",
        "fr": "Construite en 1812, la Tour du Drapeau de Hanoï est l'un des rares monuments préservés au sein de la Cité Impériale, marquant le jour sacré de la Libération de la Capitale le 10 octobre 1954.",
        "zh": "河内旗台建于1812年，是升龙皇城内少有的完好保留至今的古建筑之一，铭刻着1954年10月10日首都解放的神圣历史时刻。",
        "ko": "1812년에 축조된 하노이 깃대는 탕롱 황성 안에서 온전히 보존된 몇 안 되는 유적 중 하나로, 1954년 10월 10일 수도 해방의 성스러운 순간을 상징합니다.",
        "ja": "1812年に建設されたハノイの旗塔は、昇龍皇城の中で現存する数少ない貴重な建築遺産の一つであり、1954年10月10日の首都解放という歴史的瞬間を永遠に留めています。",
    },
    "ngo-mon-hue": {
        "vi": "Ngọ Môn nhìn về hướng nam theo dịch lý, nơi hội tụ ánh sáng và quyền uy vương triều. Phía trên là Lầu Ngũ Phụng, nơi tổ chức các đại lễ truyền lô, ban sóc và là nơi chứng kiến sự kiện thoái vị năm 1945.",
        "en": "Facing directly south according to geomantic principles, Ngo Mon Gate is where imperial authority converges with celestial light. Above sits the Five-Phoenix Pavilion, witness to major court proclamations and the historic abdication of 1945.",
        "fr": "Faisant face au sud selon les principes de la géomancie, la Porte du Midi est le lieu où l'autorité impériale s'unit à la lumière céleste. Au sommet trône le Belvédère des Cinq Phénix, témoin des grandes proclamations et de l'abdication historique de 1945.",
        "zh": "午门依照易理面南而立，乃皇权与光明汇聚之所。门楼之上建有五凤楼，见证了大朝传胪、颁朔之典，以及1945年保大帝宣布退位的重要历史转折。",
        "ko": "오문은 역학의 원리에 따라 정남향을 바라보며, 황제의 권위와 빛이 모여드는 성스러운 공간입니다. 상부의 오봉루는 과거 급제자 발표와 책력 반포 등 국가 의례가 열렸으며, 1945년 역사적인 퇴위식이 거행된 장소입니다.",
        "ja": "午門は易学の理に従い真南を向いて建ち、皇帝の威光と光が交わる神聖な場所です。上部には五鳳楼がそびえ、官吏登用発表や暦の頒布などの大礼が執り行われ、1945年の歴史的退位の舞台となりました。",
    },
    "ben-nha-rong": {
        "vi": "Ngày 5 tháng 6 năm 1911, con tàu Đô đốc Latouche-Tréville rời bến cảng Sài Gòn chở theo khát vọng độc lập tự do cháy bỏng của người thanh niên 21 tuổi Nguyễn Tất Thành.",
        "en": "On June 5, 1911, the steamship Amiral Latouche-Tréville cast off from Saigon Harbor, bearing the profound aspirations of 21-year-old patriot Nguyen Tat Thanh on his journey to find the path to national freedom.",
        "fr": "Le 5 juin 1911, le paquebot Amiral Latouche-Tréville quitta le port de Saigon, portant les ardentes aspirations du jeune patriote de 21 ans, Nguyen Tat Thanh, en quête de libération nationale.",
        "zh": "1911年6月5日，拉图什-特雷维尔海军上将号轮船缓缓驶离西贡港口，载着21岁青年阮必成寻找民族独立自由之路的赤诚炽热之志。",
        "ko": "1911년 6월 5일, 아미랄 라투슈-트레빌 호가 사이공 항구를 떠나며 21세 청년 응우옌 떳 타인의 조국 독립과 자유를 향한 뜨거운 열망을 싣고 항해를 시작했습니다.",
        "ja": "1911年6月5日、ラトゥーシュ・トレヴィル提督号はサイゴン港を静かに出航しました。21歳の青年グエン・タット・タインの、祖国の独立と自由を求める燃えるような情熱を乗せて。",
    },
}

async def generate_single(slug: str, lang: str, text: str, voice: str):
    filename = f"{slug}-{lang}.mp3"
    filepath = os.path.join(OUTPUT_DIR, filename)

    if os.path.exists(filepath) and os.path.getsize(filepath) > 5000:
        print(f"Skipping existing: {filename} ({os.path.getsize(filepath)} bytes)")
        return True

    for attempt in range(1, 4):
        try:
            print(f"Generating {filename} ({voice}) attempt {attempt}...")
            comm = edge_tts.Communicate(text, voice)
            await comm.save(filepath)
            print(f"Successfully saved: {filename} ({os.path.getsize(filepath)} bytes)")
            return True
        except Exception as e:
            print(f"Attempt {attempt} failed for {filename}: {e}")
            await asyncio.sleep(2 * attempt)
    return False

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    total = sum(len(langs) for langs in SCRIPTS.values())
    current = 0

    for slug, lang_dict in SCRIPTS.items():
        for lang, text in lang_dict.items():
            current += 1
            voice = VOICES[lang]
            print(f"[{current}/{total}] Processing {slug}-{lang}...")
            success = await generate_single(slug, lang, text, voice)
            if not success:
                print(f"Warning: Failed to generate {slug}-{lang}")
            await asyncio.sleep(1.0)

    print("\nAll tasks completed!")

if __name__ == "__main__":
    asyncio.run(main())
