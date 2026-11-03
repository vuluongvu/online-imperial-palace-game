// Kịch bản hội thoại phong cách cung đình cho các NPC trong 7 công trình

export interface DialogueChoice {
  id: string;
  label: string;
  action: 'accept_quest' | 'open_panel' | 'close' | 'custom';
  targetTab?: string;
}

export interface NpcDialogueScript {
  greeting: string;
  quote: string;
  portrait: string; // Emoji hoặc đường dẫn chân dung
  choices: DialogueChoice[];
}

export function getNpcDialogue(
  npcId: string,
  currentQuestStep: number
): NpcDialogueScript {
  switch (npcId) {
    case 'npc_gate_captain':
      if (currentQuestStep > 1) {
        return {
          portrait: '💂‍♂️',
          greeting: 'Ngọ Môn Quan Thị Vệ Thống Lĩnh – Trần Uy',
          quote:
            'Bẩm đại nhân! Cấm thành ngày đêm canh phòng nghiêm mật. Chúc đại nhân hoàn thành xuất sắc công vụ phụng sự giang sơn!',
          choices: [
            {
              id: 'c1',
              label: 'Xem sơ đồ 7 đại công trình',
              action: 'open_panel',
              targetTab: 'directory',
            },
            { id: 'c2', label: 'Tạ ơn tướng quân, ta tiếp tục công vụ', action: 'close' },
          ],
        };
      }
      return {
        portrait: '💂‍♂️',
        greeting: 'Ngọ Môn Quan Thị Vệ Thống Lĩnh – Trần Uy',
        quote:
          'Bẩm quan nhân! Ngọ Môn Quan là nơi canh giữ kỷ cương của toàn cấm thành. Người mới vào cung trước hết cần đến Lại Bộ trình diện quan Thượng Thư để nhận bản danh sách công vụ.',
        choices: [
          {
            id: 'c1',
            label: 'Đến Lại Bộ điểm danh (Nhiệm vụ 1)',
            action: 'accept_quest',
          },
          {
            id: 'c2',
            label: 'Xem sơ đồ 7 đại công trình',
            action: 'open_panel',
            targetTab: 'directory',
          },
          { id: 'c3', label: 'Tạ ơn tướng quân, tôi đã rõ', action: 'close' },
        ],
      };

    case 'npc_lai_bo_minister':
      if (currentQuestStep === 1) {
        return {
          portrait: '👨‍💼',
          greeting: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
          quote:
            'Tân khoa quan viên Minh Vương đến đúng lúc lắm. Triều đình đang cần người mẫn cán để chỉnh đốn điển chế. Ngươi hãy tiếp nhận Lệnh Bài Tập Sự, sau đó sang Hình Bộ hỗ trợ tra án!',
          choices: [
            {
              id: 'c1',
              label: 'Thần xin tuân mệnh, tiếp nhận công vụ',
              action: 'accept_quest',
            },
            {
              id: 'c2',
              label: 'Xem danh sách chức quan & điều kiện thăng chức',
              action: 'open_panel',
              targetTab: 'ranks',
            },
            { id: 'c3', label: 'Tiểu quan xin phép cáo lui', action: 'close' },
          ],
        };
      }
      if (currentQuestStep === 2) {
        return {
          portrait: '👨‍💼',
          greeting: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
          quote:
            'Đại nhân đã mang Lệnh Bài và Mật Tấu. Mau chóng sang Hình Bộ gặp Thượng Thư Bao Thanh để thụ lý điều tra vụ án mật tấu thất lạc!',
          choices: [
            {
              id: 'c1',
              label: 'Xem nhật ký nhiệm vụ Hình Bộ',
              action: 'open_panel',
              targetTab: 'quests',
            },
            { id: 'c2', label: 'Thần xin sang Hình Bộ ngay', action: 'close' },
          ],
        };
      }
      if (currentQuestStep === 3) {
        return {
          portrait: '👨‍💼',
          greeting: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
          quote:
            'Bản bộ đã nghe tin ngươi phá án thành công tại Hình Bộ! Hãy tiếp tục đến Hàn Lâm Viện vượt qua kỳ khảo thí trước khi quay về nộp báo cáo.',
          choices: [
            {
              id: 'c1',
              label: 'Xem yêu cầu khảo thí Hàn Lâm Viện',
              action: 'open_panel',
              targetTab: 'quests',
            },
            { id: 'c2', label: 'Tiểu quan xin tới Hàn Lâm Viện', action: 'close' },
          ],
        };
      }
      if (currentQuestStep === 4) {
        return {
          portrait: '👨‍💼',
          greeting: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
          quote:
            'Hay lắm! Ngươi vừa phá được mật án tại Hình Bộ, lại vừa đỗ đạt khoa cử vẻ vang tại Hàn Lâm Viện. Mau trình kết quả khảo công để bản bộ tâu lên Hoàng Thượng sắc phong!',
          choices: [
            {
              id: 'c1',
              label: 'Nộp chứng chỉ khảo công & nhận thưởng',
              action: 'accept_quest',
            },
            {
              id: 'c2',
              label: 'Mở bàn bổ nhiệm nộp đơn thăng chức',
              action: 'open_panel',
              targetTab: 'promotion',
            },
            { id: 'c3', label: 'Tiểu quan xin phép chuẩn bị', action: 'close' },
          ],
        };
      }
      return {
        portrait: '👨‍💼',
        greeting: 'Lại Bộ Thượng Thư – Phạm Công Trứ',
        quote:
          'Lại Bộ là cội nguồn của phẩm hàm quan lại. Người có công trạng ắt được thăng thưởng, kẻ trễ nải tất chịu giáng trừ. Hãy tích cực phụng sự triều đình!',
        choices: [
          {
            id: 'c1',
            label: 'Mở Bàn Bổ Nhiệm & Thăng Chức',
            action: 'open_panel',
            targetTab: 'promotion',
          },
          {
            id: 'c2',
            label: 'Xem nhật ký Công Trạng cá nhân',
            action: 'open_panel',
            targetTab: 'merit',
          },
          { id: 'c3', label: 'Tiểu quan xin cáo lui', action: 'close' },
        ],
      };

    case 'npc_hinh_bo_judge':
      if (currentQuestStep < 2) {
        return {
          portrait: '⚖️',
          greeting: 'Hình Bộ Thượng Thư – Bao Thanh',
          quote:
            'Hình Bộ là nơi giữ nghiêm phép nước. Quan nhân hãy đến Lại Bộ nhận Lệnh Bài Tập Sự và chỉ thị trước khi đến công đường.',
          choices: [
            { id: 'c1', label: 'Tiểu quan đã rõ, xin tới Lại Bộ', action: 'close' },
          ],
        };
      }
      if (currentQuestStep === 2) {
        return {
          portrait: '⚖️',
          greeting: 'Hình Bộ Thượng Thư – Bao Thanh',
          quote:
            'Đại nhân từ Lại Bộ mang lệnh bài sang đúng lúc lắm! Đêm qua có kẻ lén tráo bản mật tấu biên thùy. Mời đại nhân vào bàn hồ sơ đối chiếu chứng cứ và hạ phán quyết!',
          choices: [
            {
              id: 'c1',
              label: 'Bắt đầu phá án: Xem xét chứng cứ & Khẩu cung',
              action: 'open_panel',
              targetTab: 'clues',
            },
            {
              id: 'c2',
              label: 'Đưa ra phán quyết vụ án',
              action: 'open_panel',
              targetTab: 'verdict',
            },
            { id: 'c3', label: 'Tiểu quan xin xem xét thêm', action: 'close' },
          ],
        };
      }
      return {
        portrait: '⚖️',
        greeting: 'Hình Bộ Thượng Thư – Bao Thanh',
        quote:
          'Mật án biên cương đã được đại nhân phá giải phân minh, kẻ gian chịu tội! Công đức của đại nhân bản bộ đã ghi nhận đầy đủ gửi sang Lại Bộ.',
        choices: [
          {
            id: 'c1',
            label: 'Xem lại hồ sơ vụ án đã phá',
            action: 'open_panel',
            targetTab: 'case_overview',
          },
          { id: 'c2', label: 'Cảm tạ Thượng Thư, tiểu quan xin cáo lui', action: 'close' },
        ],
      };

    case 'npc_han_lam_examiner':
      if (currentQuestStep < 3) {
        return {
          portrait: '📖',
          greeting: 'Hàn Lâm Chưởng Viện Học Sĩ – Chu Văn',
          quote:
            'Hàn Lâm Viện là đất thánh hiền. Quan nhân hãy hoàn tất công vụ điều tra bên Hình Bộ trước khi tới ứng thí.',
          choices: [
            {
              id: 'c1',
              label: 'Đọc trước tài liệu ôn thi tại Tàng Thư Các',
              action: 'open_panel',
              targetTab: 'library',
            },
            { id: 'c2', label: 'Tiểu quan xin phép lui', action: 'close' },
          ],
        };
      }
      if (currentQuestStep === 3) {
        return {
          portrait: '📖',
          greeting: 'Hàn Lâm Chưởng Viện Học Sĩ – Chu Văn',
          quote:
            'Văn dĩ tải đạo. Triều đình đang mở kỳ khảo thí sát hạch năng lực tiến cử quan viên. Mời đại nhân ngồi vào bàn thi làm bài trắc nghiệm 3 câu!',
          choices: [
            {
              id: 'c1',
              label: 'Bắt đầu làm bài thi (3 câu trắc nghiệm)',
              action: 'open_panel',
              targetTab: 'exam',
            },
            {
              id: 'c2',
              label: 'Đọc tài liệu ôn tập tại Tàng Thư Các',
              action: 'open_panel',
              targetTab: 'library',
            },
            {
              id: 'c3',
              label: 'Xem Bảng Vàng khoa cử vinh danh',
              action: 'open_panel',
              targetTab: 'leaderboard',
            },
          ],
        };
      }
      return {
        portrait: '📖',
        greeting: 'Hàn Lâm Chưởng Viện Học Sĩ – Chu Văn',
        quote:
          'Chúc mừng đại nhân đã đỗ kỳ khảo thí vẻ vang! Văn tài của đại nhân đã được lưu danh trên Bảng Vàng. Hãy mau về Lại Bộ phục mệnh nhận thưởng.',
        choices: [
          {
            id: 'c1',
            label: 'Xem Bảng Vàng Tiến Sĩ',
            action: 'open_panel',
            targetTab: 'leaderboard',
          },
          {
            id: 'c2',
            label: 'Thi lại để nâng cao điểm số',
            action: 'open_panel',
            targetTab: 'exam',
          },
          { id: 'c3', label: 'Tiểu quan xin cáo lui', action: 'close' },
        ],
      };

    case 'npc_ngu_hoa_host':
      return {
        portrait: '🌸',
        greeting: 'Quản Sự Thượng Uyển – Nhã Lan',
        quote:
          'Dạ bẩm quan nhân! Ngự Hoa Viên đang mùa hoa đào nở rộ bên hồ sen Kim Thủy. Các vị đồng liêu đang đàm đạo ngâm thơ tại Thủy Đình, mời quan nhân ghé qua thưởng trà.',
        choices: [
          {
            id: 'c1',
            label: 'Mở khung giao lưu & gửi biểu cảm',
            action: 'open_panel',
            targetTab: 'chat',
          },
          {
            id: 'c2',
            label: 'Tổ chức tiệc hoa đào cùng quan khách',
            action: 'open_panel',
            targetTab: 'events',
          },
          { id: 'c3', label: 'Tạ ơn cô nương, ta chỉ đi dạo', action: 'close' },
        ],
      };

    case 'npc_thai_hoa_minister_out':
    case 'npc_interior_minister':
      return {
        portrait: '👑',
        greeting: 'Thừa Tướng Nội Các – Nguyễn Bá',
        quote:
          'Điện Thái Hòa là nơi hội tụ linh khí của non sông. Trăm quan sớm tối vào chầu cần giữ lòng trung chính, vì giang sơn xã tắc mà phụng sự.',
        choices: [
          {
            id: 'c1',
            label: 'Tham dự đại lễ thiết triều',
            action: 'open_panel',
            targetTab: 'court',
          },
          {
            id: 'c2',
            label: 'Xem bảng chiếu chỉ triều đình',
            action: 'open_panel',
            targetTab: 'edicts',
          },
          {
            id: 'c3',
            label: 'Điểm danh bá quan đang có mặt',
            action: 'open_panel',
            targetTab: 'officials',
          },
        ],
      };

    case 'npc_ngu_thu_scholar':
      return {
        portrait: '📜',
        greeting: 'Nội Các Đại Học Sĩ – Lê Văn Hưu',
        quote:
          'Vạn sự nơi biên ải và nông giang đều dồn về Ngự Thư Phòng qua từng tập tấu chương. Từng dòng bút phê của bệ hạ là sinh mệnh của muôn dân.',
        choices: [
          {
            id: 'c1',
            label: 'Phê duyệt các bản tấu chương khẩn',
            action: 'open_panel',
            targetTab: 'memorials',
          },
          {
            id: 'c2',
            label: 'Xem báo cáo tình hình các trấn',
            action: 'open_panel',
            targetTab: 'reports',
          },
          { id: 'c3', label: 'Tiểu quan xin phép lui ra', action: 'close' },
        ],
      };

    default:
      return {
        portrait: '👤',
        greeting: 'Quan Viên Hoàng Cung',
        quote:
          'Chào quan nhân, chúc quan nhân một ngày công vụ thuận buồm xuôi gió!',
        choices: [
          { id: 'c1', label: 'Xem thông tin công việc', action: 'open_panel' },
          { id: 'c2', label: 'Tạm biệt', action: 'close' },
        ],
      };
  }
}
